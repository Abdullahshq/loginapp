const sql = require('mssql');
const { DefaultAzureCredential } = require('@azure/identity');

const config = {
  server: process.env.AZURE_SQL_SERVER,
  database: process.env.AZURE_SQL_DATABASE,
  authentication: {
    type: 'azure-active-directory-msi-app-service',
    options: {
      tokenCredential: new DefaultAzureCredential()
    }
  },
  options: {
    encrypt: true,
    trustServerCertificate: false,
    connectTimeout: 15000,
    requestTimeout: 30000,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
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