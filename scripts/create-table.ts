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




