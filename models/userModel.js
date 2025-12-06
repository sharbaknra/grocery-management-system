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
    const sql = 'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC';
    const [rows] = await db.promise().query(sql);
    return rows;
  },

  // Get user by ID
  getById: async (id) => {
    const sql = 'SELECT id, name, email, role, created_at FROM users WHERE id = ?';
    const [rows] = await db.promise().query(sql, [id]);
    return rows[0] || null;
  },

  // Update user
  update: async (id, userData) => {
    const { name, email, role } = userData;
    const sql = 'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?';
    const [result] = await db.promise().query(sql, [name, email, role, id]);
    return result;
  },

  // Update user password
  updatePassword: async (id, hashedPassword) => {
    const sql = 'UPDATE users SET password = ? WHERE id = ?';
    const [result] = await db.promise().query(sql, [hashedPassword, id]);
    return result;
  },

  // Delete user (soft delete by setting role to inactive or hard delete)
  delete: async (id) => {
    const sql = 'DELETE FROM users WHERE id = ?';
    const [result] = await db.promise().query(sql, [id]);
    return result;
  },

  // Seed default users (idempotent)
  seedAdmin: async () => {
    const defaultUsers = [
      { name: 'Store Manager', email: 'admin@grocery.com', password: 'admin123', role: 'admin' },
      { name: 'Staff Member', email: 'staff@grocery.com', password: 'staff123', role: 'staff' },
      { name: 'Purchasing Agent', email: 'purchasing@grocery.com', password: 'purchasing123', role: 'purchasing' },
    ];

    try {
      for (const user of defaultUsers) {
        const [existing] = await db.promise().query('SELECT * FROM users WHERE email = ?', [user.email]);
        
        if (existing.length === 0) {
          const hashedPassword = await bcrypt.hash(user.password, 10);
          await db.promise().query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [user.name, user.email, hashedPassword, user.role]
          );
          console.log(`✅ Default ${user.role} created:`, user.email);
        } else {
          console.log(`ℹ️ ${user.role} already exists:`, user.email);
        }
      }
    } catch (err) {
      console.error('❌ Error seeding default users:', err);
    }
  }
};

module.exports = User;
