const { sql, poolPromise } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async findByEmail(email) {
    try {
      const pool = await poolPromise;
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
        .input('name', sql.VarChar, userData.name)
        .input('email', sql.VarChar, userData.email)
        .input('password', sql.VarChar, hashedPassword)
        .query('INSERT INTO users (name, email, password) OUTPUT INSERTED.id VALUES (@name, @email, @password)');
      
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