const db = require("../config/db");

const Product = {
  // Create Product (Quantity column removed from SQL query)
  create: async (data) => {
    const sql = `
            INSERT INTO products 
            (name, category, price, barcode, description, expiry_date, supplier, image_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
    const values = [
      data.name,
      data.category,
      data.price,
      data.barcode,
      data.description,
      data.expiry_date,
      data.supplier,
      data.image_url,
    ];
    const [result] = await db.promise().query(sql, values);
    return result.insertId;
  },

  // Get All (ADDED: JOIN stock s ON p.id = s.product_id)
  getAll: async () => {
    const sql = `
            SELECT p.*, s.quantity, s.min_stock_level 
            FROM products p
            LEFT JOIN stock s ON p.id = s.product_id
            ORDER BY p.created_at DESC
        `;
    const [rows] = await db.promise().query(sql);
    return rows;
  },

  // Get By ID (ADDED: JOIN)
  getById: async (id) => {
    const sql = `
            SELECT p.*, s.quantity, s.min_stock_level 
            FROM products p
            LEFT JOIN stock s ON p.id = s.product_id
            WHERE p.id = ?
        `;
    const [rows] = await db.promise().query(sql, [id]);
    return rows[0];
  },

  // Search (ADDED: JOIN)
  search: async (searchTerm) => {
    const sql = `
            SELECT p.*, s.quantity 
            FROM products p
            LEFT JOIN stock s ON p.id = s.product_id
            WHERE p.name LIKE ?
            ORDER BY p.created_at DESC
        `;
    const [rows] = await db.promise().query(sql, [`%${searchTerm}%`]);
    return rows;
  },

  // Update (No changes needed)
  update: async (id, data) => {
    const sql = `
            UPDATE products SET 
            name = ?, category = ?, price = ?, barcode = ?, 
            description = ?, expiry_date = ?, supplier = ?, image_url = ?
            WHERE id = ?
        `;
    const values = [
      data.name,
      data.category,
      data.price,
      data.barcode,
      data.description,
      data.expiry_date,
      data.supplier,
      data.image_url,
      id,
    ];
    const [result] = await db.promise().query(sql, values);
    return result;
  },

  // Delete (No changes needed)
  delete: async (id) => {
    const sql = `DELETE FROM products WHERE id = ?`;
    const [result] = await db.promise().query(sql, [id]);
    return result;
  },

  // Filter By Category
  filterByCategory: async (category) => {
    const sql = `
      SELECT p.*, s.quantity 
      FROM products p
      LEFT JOIN stock s ON p.id = s.product_id
      WHERE p.category = ?
    `;
    const [rows] = await db.promise().query(sql, [category]);
    return rows;
  },

  // Filter By Price Range
  filterByPrice: async (minPrice, maxPrice) => {
    const sql = `
      SELECT p.*, s.quantity
      FROM products p
      LEFT JOIN stock s ON p.id = s.product_id
      WHERE p.price BETWEEN ? AND ?
    `;
    const [rows] = await db.promise().query(sql, [minPrice, maxPrice]);
    return rows;
  },
};

module.exports = Product;


