import { Client } from 'pg';
//import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
require('dotenv').config();
import axios from 'axios';
import Fastify, { FastifyInstance, RouteShorthandOptions } from 'fastify'
import { Server, IncomingMessage, ServerResponse } from 'http'



const {
    DB_USER,
    DB_HOST,
    DB_DATABASE,
    DB_PASSWORD,
    DB_PORT,
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
    return { pong: 'it worked!' }
})

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

// POST route to write data to PostgreSQL
server.post('/accounts', async (request, reply) => {
  try {
    console.log(">>> in accounts/create ...");
    console.log(request.body);
    const { accountId, accountName} = request.body as { accountId: string, accountName: string };
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
        `INSERT INTO accounts (accountId, accountName, walletId, address) VALUES ($1, $2, $3, $4)`,
        [accountId, accountName, wallet.data.walletId, wallet.data.address]
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
        path: '../swagger-static-specification.json'
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









