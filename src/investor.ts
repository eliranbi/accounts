import { Client } from 'pg';

import fastifyCors from '@fastify/cors';
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname+'/.env' });
import axios from 'axios';
import Fastify, { FastifyInstance } from 'fastify'




const {
    DB_USER,
    DB_HOST,
    DB_DATABASE,
    DB_PASSWORD,
    WALLET_SERVICES_URL,
  } = process.env;
  
  // Create a new PostgreSQL client
  const client = new Client({
    user: DB_USER as string,
    host: DB_HOST as string,
    database: DB_DATABASE as string,
    password: DB_PASSWORD as string,
    port: 5432,
  });

// Connect to the PostgreSQL server
client.connect();

// Create a fastify server instance
const server: FastifyInstance = Fastify({})
// Register the CORS plugin
server.register(fastifyCors);

server.get('/ping', async (request, reply) => {
    console.log(">>> in ping ...");

    return { message: 'account services is up - ' + new Date() }
})


//Get - Investor information 
server.get('/investors/:investorId',  async (request, reply) => {
  try {
    console.log(">>> in investors ...");
    const { investorId } = request.params as { investorId: string };
    console.log(request.params);

    // Execute a query to select data from a table
    const result = await client.query('SELECT * FROM investors WHERE investorId = $1',[investorId]);
    // Access the rows returned by the query
    const rows = result.rows;
    if(rows == null || rows.length <=0){
        throw {status : 400 , message : 'Investor does not exist'}
    }
    console.log(rows);
    reply.send(rows[0])
  } catch (e) {
    console.error('Error reading data:', e);
    reply.status(400).send({ error: (e as Error).message });
  }
});

//GET - Investor accounts 
server.get('/investors/accounts/:investorId',  async (request, reply) => {
  try {
    console.log(">>> in investors ...");
    const { investorId } = request.params as { investorId: string };
    console.log(request.params);

    // Execute a query to select data from a table
    const result = await client.query('SELECT * FROM accounts WHERE investorId = $1',[investorId]);
    // Access the rows returned by the query
    const rows = result.rows;
    if(rows == null || rows.length <=0){
        throw {status : 400 , message : 'No account for investor'}
    }
    console.log(rows);
    reply.send(rows)
  } catch (e) {
    console.error('Error reading data:', e);
    reply.status(400).send({ error: (e as Error).message });
  }
});

//POST - Create investor 
server.post('/investors', async (request, reply) => {
  try {
    console.log(">>> in investors/create ...");
    console.log(request.body);
    const { investorId, investorName} = request.body as { investorId: string, investorName: string };
    try {
        const { rows } = await client.query('SELECT * FROM investors WHERE investorId = $1', [investorId])        
        if (rows.length > 0){
            console.log('account:', rows[0])
            throw {status : 400 , message : 'Error investor already exist'}
        }
    } catch (error) {
        console.error('Error investorId already exist :', error);
        throw {status : 400 , message : 'Error investor already exist'}
    }

    await client.query(
        `INSERT INTO investors (investorId, investorName) VALUES ($1, $2)`,
        [investorId, investorName]
    ); 
    reply.send({ message: 'Data inserted successfully!' });
  } catch (e) {
    console.error(e);
    console.error('Error writing data:', e);
    reply.status(400).send({ error: (e as Error).message });
  }
});


// GET route to read data from PostgreSQL
server.get('/accounts/:accountId',  async (request, reply) => {
  try {
    console.log(">>> in accounts ...");
    const { accountId } = request.params as { accountId: string };
    console.log(request.params);

    // Execute a query to select data from a table
    const result = await client.query('SELECT * FROM accounts WHERE accountId = $1',[accountId]);
    // Access the rows returned by the query
    const rows = result.rows;
    if(rows == null || rows.length <=0){
        throw {status : 400 , message : 'Account does not exist'}
    }
    console.log(rows);
    reply.send(rows[0])
  } catch (e) {
    console.error('Error reading data:', e);
    reply.status(400).send({ error: (e as Error).message });
  }
});

// POST - Create an account
server.post('/accounts', async (request, reply) => {
  try {
    console.log(">>> in accounts/create ...");
    console.log(request.body);
    const { accountId, accountName, investorId} = request.body as { accountId: string, accountName: string, investorId: string };
    
    try {
      const { rows } = await client.query('SELECT * FROM investors WHERE investorId = $1', [investorId])        
      if (rows.length <= 0){          
          throw {status : 400 , message : 'Please create investor account first'}
      }
  } catch (error) {
      console.error('Error investorId does not exist :', error);
      throw {status : 400 , message : 'Error investorId does not exist - Please create investor first'}
  }

    try {
        const { rows } = await client.query('SELECT * FROM accounts WHERE accountId = $1', [accountId])        
        if (rows.length > 0){
            console.log('account:', rows[0])
            throw {status : 400 , message : 'Error account already exist'}
        }
    } catch (error) {
        console.error('Error account already exist :', error);
        throw {status : 400 , message : 'Error account already exist'}
    }

    // Call wallet api to get walletId and address ... 
    console.log(">>> calling wallet services ...");
    console.log(WALLET_SERVICES_URL);
    //const WALLET_SERVICES_URL = 'http://localhost:3011/wallet/create';
    
    try{
        const wallet = await axios.post(WALLET_SERVICES_URL as string,{});
        console.log(wallet.data);    

        console.log(">>> saving new account to database ...");    
        // Execute a query to insert data into a table
        await client.query(
        `INSERT INTO accounts (accountId, accountName, investorId, walletId, address) VALUES ($1, $2, $3, $4, $5)`,
        [accountId, accountName, investorId, wallet.data.walletId, wallet.data.address]
        );

    }catch(error){
        console.error('Error creatting wallet:', error);
        throw {status : 400 , message : 'Error creatting wallet'}
    }
    
    reply.send({ message: 'Data inserted successfully!' });

  } catch (e) {
    console.error(e);
    console.error('Error writing data:', e);
    reply.status(400).send({ error: (e as Error).message });
  }
});

//adding swagger
server.register(require('@fastify/swagger'), {
    mode: 'static',
    specification:{
        path: __dirname + '/swagger-static-specification.json'
    }
})

server.register(require('./swagger'))

try {
    server.listen({ port: 3000 }, (err) => {
    if (err) throw err
    })
} catch (err) {
    server.log.error(err)
    process.exit(1)
  }


//////// create tables scripts /////////

import { Client } from 'pg';
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname+'/.env' });

const {
    DB_USER,
    DB_HOST,
    DB_DATABASE,
    DB_PASSWORD
  } = process.env;
  
console.log("******************\n db connection *********************");
console.log("DB_USER: " + DB_USER);
console.log("DB_HOST: " + DB_HOST);
console.log("DB_DATABASE: " + DB_DATABASE);
console.log("DB_PASSWORD: " + DB_PASSWORD);

  // Create a new PostgreSQL client
  const client = new Client({
    user: DB_USER,
    host: DB_HOST,
    database: DB_DATABASE,
    password: DB_PASSWORD,
    port: 5432,
  });


// Connect to the PostgreSQL server
client.connect();

// Function to create the table
async function createAccountTable() {
  try {
    // Drop account table 
    const dropTableQuery = `DROP TABLE IF EXISTS accounts;`;
    await client.query(dropTableQuery);
    // Create the 'accounts' table
    await client.query(
      `CREATE TABLE accounts (
        accountId VARCHAR,
        accountName VARCHAR,
        investorId VARCHAR,
        walletId VARCHAR,
        address VARCHAR,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (accountId, investorId),
        FOREIGN KEY (investorId) REFERENCES investors (investorId)        
      )`);

    console.log('accounts table created successfully!');
  } catch (error) {
    console.error('Error creating table:', error);
  } 
}

  async function inserToAccountTable() {
    try {      
      // inserToAccountTable
      await client.query(
        `INSERT INTO accounts (accountId, investorId, accountName, walletId, address) VALUES ($1, $2, $3, $4, $5)`,
        ['0001001', 'I0001001', 'acct1001','wallet1001', '0x012020fhe03999djs99k002920343jd']
      );
      console.log('insert successfully!');
    } catch (error) {
      console.error('Error creating table:', error);
    }
  }

  async function createWalletTable() {
    try {
      // Create the 'wallets' table
      const dropTableQuery = `DROP TABLE IF EXISTS wallets;`;
      await client.query(dropTableQuery);
      await client.query(`
        CREATE TABLE wallets (
          walletId VARCHAR PRIMARY KEY,
          privateKey VARCHAR,          
          address VARCHAR,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
  
      console.log('wallets table created successfully!');
    } catch (error) {
      console.error('Error creating table:', error);
    }
  }

  async function inserToWalletTable() {
    try {

    const walletId = '265526';
    const privateKey = '0x421273a2caec0e0b542eb3bcc1c7d5c0769b5227b4f61fa2003c8a714c370402';
    const address = '0xf5c8552afc99a19b8ceaf092d2db58cb9b2e950a';

      // inserToWalletTable
      await client.query(
        `INSERT INTO wallets (walletId, privateKey, address) VALUES ($1, $2, $3)`,
        [walletId, privateKey, address]
      );
      console.log('insert successfully!');
    } catch (error) {
      console.error('Error creating table:', error);
    }
  }
  

//Function to create the investor table
async function createInvestorTable() {
  try {
    // Create the 'investors' table
  
    const alterTableQuery = `ALTER TABLE accounts DROP CONSTRAINT accounts_investorid_fkey;`
    const dropTableQuery = `DROP TABLE IF EXISTS investors;`;
    await client.query(alterTableQuery);
    await client.query(dropTableQuery);

    await client.query(`
      CREATE TABLE investors (
        investorId VARCHAR PRIMARY KEY,
        investorName VARCHAR,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`
    );
    console.log('Investor table created successfully!');
  } catch (error) {
    console.error('Error creating investor table:', error);
  } 
}

async function inserToInvestorTable() {
  try {
    // inserToAccountTable
    await client.query(
      `INSERT INTO investors (investorId, investorName) VALUES ($1, $2)`,
      ['I0001001', 'inv1001']
    );
    console.log('insert successfully!');
  } catch (error) {
    console.error('Error creating table:', error);
  } 
}


async function runTableCreation(){
  await createInvestorTable();
  await createAccountTable();
  await createWalletTable();
}

async function testTableInserts(){
  await inserToInvestorTable();
  await inserToAccountTable();
  await inserToWalletTable();
}
 
runTableCreation();
//testTableInserts();

////////////////// swagger ///////////
/*

"/investors" : {
    "post" : {
        "summary" : "Create new investor",
        "description": "Create new investor",
        "tags": [
          "Investors"
        ],
        "produces": ["application/json"],
        "consumes": ["application/json"],
        "parameters": [
            {
                "in": "body",
                "name": "body",
                "description": "investor create object",
                "required": true,
                "schema": {
                    "$ref": "#/definitions/investorRequestBody"                                                    
                }
            }
        ],
        "responses": {
            "200": {
                "description": "successful operation",
                "schema": {                        
                        "$ref": "#/definitions/successfulResponse"                        
                }
            },
            "400": {
                "description": "Invalid status value",
                "schema": {
                    "$ref": "#/definitions/invalidResponse"
                }
            }
        }
    }
},
"/investors/{investorId}" : {
    "get" : {
        "summary" : "Get investor",
        "description": "Get investor",
        "tags": [
          "Investors"
        ],
        "produces": ["application/json"],
        "parameters": [
            {
                "name": "investorId",
                "in": "path",
                "description": "InvestorId to get",
                "required": true,
                "type": "string",
                "example": "INV00019918321"
            }                
        ],
        "responses": {
            "200": {
                "description": "successful operation",
                "schema": {
                    "type": "object",
                    "items": {
                        "$ref": "#/definitions/investor"
                    }
                }
            },
            "400": {
                "description": "Invalid status value",
                "schema": {
                    "$ref": "#/definitions/invalidResponse"
                }
            }
        }
    }
},
"/investors/accounts/{investorId}" : {
    "get" : {
        "summary" : "Get investor accounts",
        "description": "Get investor accounts",
        "tags": [
          "Investors"
        ],
        "produces": ["application/json"],
        "parameters": [
            {
                "name": "investorId",
                "in": "path",
                "description": "InvestorId to get",
                "required": true,
                "type": "string",
                "example": "INV00019918321"
            }                
        ],
        "responses": {
            "200": {
                "description": "successful operation",
                "schema": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/account"
                    }
                }
            },
            "400": {
                "description": "Invalid status value",
                "schema": {
                    "$ref": "#/definitions/invalidResponse"
                }
            }
        }
    }
}

"investor": {
    "type": "object",
    "properties": {
        "investorId": { "type": "integer" },
        "investorName": { "type": "string" },
        "createAt": { "type": "string" }
    }
},

"investorRequestBody": {
        "x-name": "body", 
        "type": "object",
        "required": [
          "investorId"          
       ],
        "properties": {
            "investorId": {
                "type": "string",
                "example": "INV00019918321"
            },
            "investorName": {
                "type": "string",
                "example": "STT MMF Investor"
            }
        }
    },



*/




