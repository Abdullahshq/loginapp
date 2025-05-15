const sql = require('mssql');

// Azure SQL Database configuration with Managed Identity
const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  authentication: {
    type: 'azure-active-directory-msi-app-service'
  },
  options: {
    encrypt: true
  }
};

// Create connection pool
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to Azure SQL Database');
    return pool;
  })
  .catch(err => console.error('Database Connection Failed: ', err));

module.exports = {
  sql,
  poolPromise
};