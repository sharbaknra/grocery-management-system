// models/userModel.js
const db = require('../config/db');
const bcrypt = require('bcrypt');

const User = {
  // Create new user
  create: async (userData) => {
    const { name, email, password, role = 'customer' } = userData;
    // Default to 'customer' if role not provided (defensive default)
    const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
    const [result] = await db.promise().query(sql, [name, email, password, role]);
    return { id: result.insertId, name, email, role };
  },

  // Find user by email
  findByEmail: async (email) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await db.promise().query(sql, [email]);
    return rows;
  },

  // Get all users (excluding passwords ideally)
  getAll: async () => {
    const sql = 'SELECT id, name, email, role, created_at FROM users';
    const [rows] = await db.promise().query(sql);
    return rows;
  },

  // Seed admin user
  seedAdmin: async () => {
    const adminEmail = 'admin@grocery.com';
    const adminPassword = 'admin123';

    try {
      // Check if admin already exists
      const [existing] = await db.promise().query('SELECT * FROM users WHERE email = ?', [adminEmail]);
      
      if (existing.length === 0) {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        await db.promise().query(
          'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
          ['Admin', adminEmail, hashedPassword, 'admin']
        );
        console.log('✅ Default admin created:', adminEmail);
      } else {
        console.log('ℹ️ Admin already exists:', adminEmail);
      }
    } catch (err) {
      console.error('❌ Error seeding admin:', err);
    }
  }
};

module.exports = User;
