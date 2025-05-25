const { sql, poolPromise, isConnected } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async findByEmail(email) {
    try {
      const pool = await poolPromise;
      if (!pool) {
        throw new Error('Database connection not available');
      }
      const result = await pool.request()
        .input('email', sql.VarChar, email)
        .query('SELECT * FROM users WHERE email = @email');
      
      return result.recordset[0];
    } catch (error) {
      console.error('Error finding user:', error);
      throw error;
    }
  }

  static async create(userData) {
    try {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      const pool = await poolPromise;
      const result = await pool.request()
        .input('username', sql.VarChar(50), userData.username)
        .input('email', sql.VarChar(100), userData.email)
        .input('password', sql.VarChar(255), hashedPassword)
        .query('INSERT INTO users (username, email, password) VALUES (@username, @email, @password); SELECT SCOPE_IDENTITY() AS id;');
      
      return result.recordset[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async comparePassword(candidatePassword, hash) {
    return bcrypt.compare(candidatePassword, hash);
  }
}

module.exports = User;