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

  // Seed admin and staff default users (idempotent)
  seedAdmin: async () => {
    const adminEmail = 'admin@grocery.com';
    const adminPassword = 'admin123';
    const staffEmail = 'staff@grocery.com';
    const staffPassword = 'staff123';

    try {
      // Check if admin already exists
      const [existingAdmin] = await db.promise().query('SELECT * FROM users WHERE email = ?', [adminEmail]);
      
      if (existingAdmin.length === 0) {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        await db.promise().query(
          'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
          ['Admin', adminEmail, hashedPassword, 'admin']
        );
        console.log('✅ Default admin created:', adminEmail);
      } else {
        console.log('ℹ️ Admin already exists:', adminEmail);
      }

      // Check if staff already exists
      const [existingStaff] = await db.promise().query('SELECT * FROM users WHERE email = ?', [staffEmail]);

      if (existingStaff.length === 0) {
        const hashedStaffPassword = await bcrypt.hash(staffPassword, 10);
        await db.promise().query(
          'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
          ['Staff Member', staffEmail, hashedStaffPassword, 'staff']
        );
        console.log('✅ Default staff created:', staffEmail);
      } else {
        console.log('ℹ️ Staff already exists:', staffEmail);
      }
    } catch (err) {
      console.error('❌ Error seeding default users:', err);
    }
  }
};

module.exports = User;
