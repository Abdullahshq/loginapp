const sql = require('mssql');

// Azure SQL Database configuration
const config = {
  server: process.env.AZURE_SQL_SERVER,
  database: process.env.AZURE_SQL_DATABASE,
  port: parseInt(process.env.AZURE_SQL_PORT, 10),
  authentication: {
    type: process.env.AZURE_SQL_AUTHENTICATIONTYPE
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