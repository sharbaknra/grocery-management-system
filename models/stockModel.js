const db = require("../config/db");

const Stock = {
  // Initializes stock for a NEW product
  create: async (productId, quantity) => {
    const sql = `INSERT INTO stock (product_id, quantity) VALUES (?, ?)`;
    const [result] = await db.promise().query(sql, [productId, quantity]);
    return result;
  },

  // Fetches the current stock count and minimum level (used by productModel JOINs)
  getByProductId: async (productId) => {
    const sql = `SELECT * FROM stock WHERE product_id = ?`;
    const [rows] = await db.promise().query(sql, [productId]);
    return rows[0];
  },

  // (This is the logic for 2.8.2, included here for file completion)
  updateQuantity: async (productId, newQuantity) => {
    const sql = `
            UPDATE stock 
            SET quantity = ?, last_restock_date = NOW() 
            WHERE product_id = ?
        `;
    const [result] = await db.promise().query(sql, [newQuantity, productId]);
    return result;
  },

  // (This is the logic for 2.8.3, included here for file completion)
  getLowStock: async () => {
    const sql = `
            SELECT p.name, s.quantity, s.min_stock_level 
            FROM products p
            JOIN stock s ON p.id = s.product_id
            WHERE s.quantity <= s.min_stock_level
        `;
    const [rows] = await db.promise().query(sql);
    return rows;
  },

  // Delete stock entry when product is deleted
  deleteByProductId: async (productId) => {
    const sql = `DELETE FROM stock WHERE product_id = ?`;
    const [result] = await db.promise().query(sql, [productId]);
    return result;
  },
};

module.exports = Stock;


