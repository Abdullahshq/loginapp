const sql = require('mssql');

// Parse connection string
function parseConnectionString(connectionString) {
  if (!connectionString) {
    throw new Error('Connection string is undefined or empty');
  }
  
  console.log('Attempting to parse connection string:', connectionString);
  
  const serverMatch = connectionString.match(/Server=([^;]+)/i);
  const databaseMatch = connectionString.match(/Database=([^;]+)/i);
  
  if (!serverMatch || !databaseMatch) {
    throw new Error(`Invalid connection string format. serverMatch: ${!!serverMatch}, databaseMatch: ${!!databaseMatch}`);
  }

  return {
    server: serverMatch[1],
    database: databaseMatch[1],
    authentication: {
      type: 'azure-active-directory-default'
    }
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