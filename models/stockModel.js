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

  // Atomic increment used by /restock
  restock: async (productId, quantity) => {
    const sql = `
            UPDATE stock
            SET quantity = quantity + ?, last_restock_date = NOW()
            WHERE product_id = ?
        `;
    const [result] = await db.promise().query(sql, [quantity, productId]);
    return result;
  },

  // Atomic decrement used by /reduce (never drops below zero)
  reduce: async (productId, quantity) => {
    const sql = `
            UPDATE stock
            SET quantity = quantity - ?
            WHERE product_id = ?
              AND quantity >= ?
        `;
    const [result] = await db.promise().query(sql, [quantity, productId, quantity]);
    return result;
  },

  // Get low stock items (Module 2.8.3)
  // Returns products where quantity > 0 AND quantity < min_stock_level AND min_stock_level > 0
  // (Items with quantity = 0 are "Out of Stock", not "Low Stock")
  // (min_stock_level = 0 means no alert, so we exclude those)
  getLowStock: async () => {
    const sql = `
            SELECT p.id, p.name, s.quantity, s.min_stock_level 
            FROM products p
            JOIN stock s ON p.id = s.product_id
            WHERE s.quantity > 0
              AND s.quantity < s.min_stock_level
              AND s.min_stock_level > 0
            ORDER BY s.quantity ASC
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

  // Log stock movement (Module 2.8.7)
  // Records all inventory changes for auditing and compliance
  logMovement: async (productId, userId, changeAmount, reason) => {
    const sql = `
            INSERT INTO stock_movements (product_id, user_id, change_amount, reason)
            VALUES (?, ?, ?, ?)
        `;
    const [result] = await db.promise().query(sql, [productId, userId, changeAmount, reason]);
    return result;
  },

  // Get stock movement history (Optional - for viewing logs)
  getMovementHistory: async (productId = null, limit = 100) => {
    let sql = `
            SELECT 
                sm.movement_id,
                sm.product_id,
                p.name AS product_name,
                sm.user_id,
                u.name AS user_name,
                sm.change_amount,
                sm.reason,
                sm.timestamp
            FROM stock_movements sm
            JOIN products p ON sm.product_id = p.id
            JOIN users u ON sm.user_id = u.id
        `;
    
    const params = [];
    if (productId) {
      sql += ` WHERE sm.product_id = ?`;
      params.push(productId);
    }
    
    sql += ` ORDER BY sm.timestamp DESC LIMIT ?`;
    params.push(limit);
    
    const [rows] = await db.promise().query(sql, params);
    return rows;
  },
};

module.exports = Stock;



