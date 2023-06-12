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









