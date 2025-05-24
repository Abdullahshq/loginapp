const sql = require('mssql');

// Parse connection string
function parseConnectionString(connectionString) {
  const regex = /Server=([^;]+);Database=([^;]+);User Id=([^;]+);Password=([^;]+)/i;
  const matches = connectionString.match(regex);
  if (!matches) throw new Error('Invalid connection string format');
  return {
    server: matches[1],
    database: matches[2],
    user: matches[3],
    password: matches[4]
  };
}

const connectionConfig = parseConnectionString(process.env.AZURE_SQL_CONNECTION_STRING);
const config = {
  ...connectionConfig,
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