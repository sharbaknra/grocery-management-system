// models/itemModel.js

const db = require('../config/db');

// All queries related to "items" table
const Item = {
  // Get all items
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM items');
    return rows;
  },

  // Get single item by ID
  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM items WHERE id = ?', [id]);
    return rows[0];
  },

  // Add a new item
  create: async (data) => {
    const { name, category, price, quantity } = data;
    const [result] = await db.query(
      'INSERT INTO items (name, category, price, quantity) VALUES (?, ?, ?, ?)',
      [name, category, price, quantity]
    );
    return { id: result.insertId, ...data };
  },

  // Update an item
  update: async (id, data) => {
    const { name, category, price, quantity } = data;
    await db.query(
      'UPDATE items SET name = ?, category = ?, price = ?, quantity = ? WHERE id = ?',
      [name, category, price, quantity, id]
    );
    return { id, ...data };
  },

  // Delete an item
  delete: async (id) => {
    await db.query('DELETE FROM items WHERE id = ?', [id]);
    return { message: 'Item deleted successfully' };
  },
};

module.exports = Item;
