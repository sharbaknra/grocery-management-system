const db = require("../config/db");

const Order = {
  // Create a new order
  create: async (orderData) => {
    const { user_id, status, total_price, tax_applied, discount_applied } = orderData;
    const sql = `
            INSERT INTO orders (user_id, status, total_price, tax_applied, discount_applied)
            VALUES (?, ?, ?, ?, ?)
        `;
    const [result] = await db.promise().query(sql, [
      user_id,
      status || "Pending",
      total_price || 0.00,
      tax_applied || 0.00,
      discount_applied || 0.00,
    ]);
    return result.insertId; // Returns order_id
  },

  // Get order by ID
  getById: async (orderId) => {
    const sql = `
            SELECT o.*, u.name AS user_name, u.email AS user_email
            FROM orders o
            JOIN users u ON o.user_id = u.id
            WHERE o.order_id = ?
        `;
    const [rows] = await db.promise().query(sql, [orderId]);
    return rows[0];
  },

  // Get all orders (for Admin/Staff) - Module 2.9.5
  getAll: async () => {
    const sql = `
            SELECT 
                o.order_id,
                o.user_id,
                o.status,
                o.total_price,
                o.tax_applied,
                o.discount_applied,
                o.created_at,
                o.updated_at,
                u.name AS user_name,
                u.email AS user_email
            FROM orders o
            JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
        `;
    const [rows] = await db.promise().query(sql);
    return rows;
  },

  // Get orders by user ID (for customers to see their own orders) - Module 2.9.5
  getByUserId: async (userId) => {
    const sql = `
            SELECT 
                o.order_id,
                o.user_id,
                o.status,
                o.total_price,
                o.tax_applied,
                o.discount_applied,
                o.created_at,
                o.updated_at
            FROM orders o
            WHERE o.user_id = ?
            ORDER BY o.created_at DESC
        `;
    const [rows] = await db.promise().query(sql, [userId]);
    return rows;
  },

  // Update order status
  updateStatus: async (orderId, status) => {
    const sql = `
            UPDATE orders
            SET status = ?, updated_at = NOW()
            WHERE order_id = ?
        `;
    const [result] = await db.promise().query(sql, [status, orderId]);
    return result;
  },

  // Update order (for checkout - update total_price, tax, discount)
  update: async (orderId, orderData) => {
    const { total_price, tax_applied, discount_applied, status } = orderData;
    const sql = `
            UPDATE orders
            SET total_price = ?,
                tax_applied = ?,
                discount_applied = ?,
                status = ?,
                updated_at = NOW()
            WHERE order_id = ?
        `;
    const [result] = await db.promise().query(sql, [
      total_price,
      tax_applied,
      discount_applied,
      status,
      orderId,
    ]);
    return result;
  },
};

module.exports = Order;

