const sql = require('mssql');
const { DefaultAzureCredential } = require('@azure/identity');

const config = {
  connectionString: process.env.AZURE_SQL_CONNECTION_STRING,
  options: {
    encrypt: true,
    trustServerCertificate: false
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
    console.error('FATAL AUTH ERROR:', {
        code: err.code,
        message: err.message,
        details: err.originalError?.info?.message || 'No additional details',
        stack: err.stack
    });
    process.exit(1);
});

module.exports = {
  sql,
  poolPromise,
  // Add a helper function to check if connection is available
  isConnected: () => pool !== null
};