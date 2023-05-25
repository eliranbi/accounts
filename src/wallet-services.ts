import { Client } from 'pg';
import fastifyCors from '@fastify/cors';
import Fastify, { FastifyInstance, RouteShorthandOptions } from 'fastify'
import ethWallet from 'ethereumjs-wallet'
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
    return { pong: 'wallet services worked!' }
})

// GET route to read data from PostgreSQL
server.get('/wallet/:address',  async (request, reply) => {
  try {
    console.log(">>> in wallet get ...");
    const { address } = request.params as { address: string };
    console.log(request.params);
    const wallet = {
        'walletId' : '',
        'address'  : ''
    }
    reply.send(wallet)
  } catch (error) {
    console.error('Error reading data:', error);
    reply.status(500).send({ error: 'Error reading data' });
  }
});

// POST route to write data to PostgreSQL
server.post('/wallet', async (request, reply) => {
  try {
    console.log(">>> in wallet/create ...");
    console.log(request.body);
    
    const walletId = Math.floor(100000 + Math.random() * 900000);
    const randomWallet = ethWallet.generate();
    
    const walletData = {
      walletId: walletId,  
      privateKey: randomWallet.getPrivateKeyString(),
      address: randomWallet.getAddressString()
    };

    console.log(walletData);
    
    const privateKey = randomWallet.getPrivateKeyString();
    const address = randomWallet.getAddressString();

    // Execute a query to insert data into a table
    await client.query(
      `INSERT INTO wallets (walletId, address, privateKey) VALUES ($1, $2, $3)`,
      [walletId, address, privateKey]
    );

    reply.send(walletData);

} catch (error) {
    console.error('Error writing data:', error);
    reply.status(500).send({ error: 'Error writing data' });
  }
});


// Start the server
const start = async () => {
    try {
      await server.listen({ port: 3011 })  
      const address = server.server.address()
      const port = typeof address === 'string' ? address : address?.port
    } catch (err) {
      server.log.error(err)
      process.exit(1)
    }
  }
  start()










