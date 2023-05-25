import { Client } from 'pg';
require('dotenv').config();

const {
    DB_USER,
    DB_HOST,
    DB_DATABASE,
    DB_PASSWORD,
    DB_PORT,
  } = process.env;
  
  // Create a new PostgreSQL client
  const client = new Client({
    user: DB_USER,
    host: DB_HOST,
    database: DB_DATABASE,
    password: DB_PASSWORD,
    port: DB_PORT,
  });


// Connect to the PostgreSQL server
client.connect();

// Function to create the table
async function createAccountTable() {
  try {
    // Create the 'accounts' table
    await client.query(`
      CREATE TABLE accounts (
        accountId VARCHAR PRIMARY KEY,
        accountName VARCHAR,
        walletId VARCHAR,
        address VARCHAR,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Table created successfully!');
  } catch (error) {
    console.error('Error creating table:', error);
  } finally {
    // Close the client connection
    //client.end();
  }
}

  async function inserToAccountTable() {
    try {
      // inserToAccountTable
      await client.query(
        `INSERT INTO accounts (accountId, accountName,walletId, address) VALUES ($1, $2, $3, $4)`,
        ['0001001', 'acct1001', '00001', '0x012020fhe03999djs99k002920343jd']
      );
      console.log('insert successfully!');
    } catch (error) {
      console.error('Error creating table:', error);
    } finally {
      // Close the client connection
      client.end();
    }
  }

  async function createWalletTable() {
    try {
      // Create the 'wallets' table
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
    } finally {
      // Close the client connection
      //client.end();
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
    } finally {
      // Close the client connection
      client.end();
    }
  }
  

// Call the function to create the table
//createAccountTable();
//inserToAccountTable();
createWalletTable();
inserToWalletTable();

