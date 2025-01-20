// config/knexfile.js
require('dotenv').config({ path: './.env' }); // Load environment variables
const path = require('path');
// console.log('DB_HOST:', process.env.DB_HOST);
// console.log('DB_USER:', process.env.DB_USER);
// console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
// console.log('DB_NAME:', process.env.DB_NAME);
// console.log('DB_PORT:', process.env.DB_PORT);


module.exports = {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  },
  pool: {
    min: 2,
    max: 10,
    acquireTimeoutMillis: 30000, // Optional: Adjust pool acquire timeout
  },
  migrations: {
    directory: path.resolve(__dirname, '../src/mysql/migrations'), // Set migrations directory to 'mysql/migrations'
    tableName: 'knex_migrations',
  },
  seeds: {
    directory: path.resolve(__dirname, '../src/mysql/seeds'),
    tableName: 'knex_seeds',
  },
};
