// models/userModel.js
const db = require('../config/db');

const User = {
  // Create new user
  create: async (userData) => {
    const { name, email, password } = userData;
    const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    const [result] = await db.query(sql, [name, email, password]);
    return { id: result.insertId, name, email };
  },

  // Find user by email
  findByEmail: async (email) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await db.query(sql, [email]);
    return rows;
  },

  // Get all users (excluding passwords ideally)
  getAll: async () => {
    const sql = 'SELECT id, name, email, role, created_at FROM users';
    const [rows] = await db.query(sql);
    return rows;
  }
};

module.exports = User;
