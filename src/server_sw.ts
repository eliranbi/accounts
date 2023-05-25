import { Client } from 'pg';
import fastify from 'fastify';
import fastifyCors from 'fastify-cors';
import fastifySwagger from 'fastify-swagger';

// Create a new PostgreSQL client
const client = new Client({
  user: 'your_username',
  host: 'your_host',
  database: 'your_database',
  password: 'your_password',
  port: 5432, // or your PostgreSQL port
});

// Connect to the PostgreSQL server
client.connect();

// Create a fastify server instance
const app = fastify();

// Register the CORS plugin
app.register(fastifyCors);

// Register the Swagger plugin
app.register(fastifySwagger, {
  routePrefix: '/documentation',
  swagger: {
    info: {
      title: 'PostgreSQL API',
      description: 'API for reading and writing data to PostgreSQL',
      version: '1.0.0',
    },
    host: 'localhost:3000', // Update with your host
    schemes: ['http'], // Update with your schemes (http, https, etc.)
    consumes: ['application/json'],
    produces: ['application/json'],
  },
  exposeRoute: true,
});

// GET route to read data from PostgreSQL
app.get('/read', async (request, reply) => {
  try {
    // Execute a query to select data from a table
    const result = await client.query('SELECT * FROM your_table');

    // Access the rows returned by the query
    const rows = result.rows;

    reply.send(rows);
  } catch (error) {
    console.error('Error reading data:', error);
    reply.status(500).send({ error: 'Error reading data' });
  }
});

// POST route to write data to PostgreSQL
app.post('/write', async (request, reply) => {
  try {
    const { column1, column2 } = request.body as { column1: string; column2: string };

    // Execute a query to insert data into a table
    await client.query(
      `INSERT INTO your_table (column1, column2) VALUES ($1, $2)`,
      [column1, column2]
    );

    reply.send({ message: 'Data inserted successfully!' });
  } catch (error) {
    console.error('Error writing data:', error);
    reply.status(500).send({ error: 'Error writing data' });
  }
});

// Start the server
const port = 3000;
app.listen(port, (err) => {
  if (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
  console.log(`Server is running on port ${port}`);
});
