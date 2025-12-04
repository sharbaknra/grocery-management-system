/**
 * Migration: Add new user roles (cashier, purchasing, manager)
 * Run with: node database/migrations/add_user_roles.js
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

async function migrate() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    console.log('🔄 Updating role column to support new roles...');
    
    await conn.execute(`
      ALTER TABLE users 
      MODIFY COLUMN role ENUM('admin', 'manager', 'cashier', 'purchasing', 'staff', 'customer') 
      NOT NULL DEFAULT 'customer'
    `);
    
    console.log('✅ Role column updated successfully!');
    console.log('');
    console.log('New roles available:');
    console.log('  - admin (Store Manager)');
    console.log('  - manager (Store Manager)');
    console.log('  - cashier (Cashier/POS Operator)');
    console.log('  - purchasing (Purchasing Agent)');
    console.log('  - staff (General Staff)');
    console.log('  - customer (Customer)');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    await conn.end();
  }
}

migrate();

