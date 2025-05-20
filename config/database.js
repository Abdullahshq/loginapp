const sql = require('mssql');

const config = {
  server: process.env.AZURE_SQL_SERVER,
  database: process.env.AZURE_SQL_DATABASE,
  user: process.env.AZURE_SQL_USER,
  password: process.env.AZURE_SQL_PASSWORD,
  options: {
    encrypt: true,
    trustServerCertificate: false,
    connectTimeout: 10000, // Reduced from 15000
    requestTimeout: 20000, // Reduced from 30000
    pool: {
      max: 10,
      min: 1, // Changed from 0 to maintain warm connections
      idleTimeoutMillis: 30000,
      acquireTimeoutMillis: 10000
    }
  }
};

// Create connection pool
let pool = null;
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(p => {
    console.log('Connected to Azure SQL Database');
    pool = p;
    return pool;
  })
  .catch(err => {
    console.error('Database Connection Failed: ', err);
    console.error('Error details:', err.originalError ? err.originalError : 'No additional details');
    // Return a rejected promise to ensure errors propagate properly
    return Promise.reject(err);
  });

module.exports = {
  sql,
  poolPromise,
  // Add a helper function to check if connection is available
  isConnected: () => pool !== null
};