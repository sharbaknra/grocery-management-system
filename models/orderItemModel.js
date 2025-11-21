const db = require("../config/db");

const OrderItem = {
  // Create order item (used when adding items to order)
  create: async (itemData) => {
    const { order_id, product_id, quantity, unit_price_at_sale } = itemData;
    const sql = `
            INSERT INTO order_items (order_id, product_id, quantity, unit_price_at_sale)
            VALUES (?, ?, ?, ?)
        `;
    const [result] = await db.promise().query(sql, [
      order_id,
      product_id,
      quantity,
      unit_price_at_sale,
    ]);
    return result.insertId; // Returns order_item_id
  },

  // Create multiple order items in a single transaction
  createMultiple: async (items, connection = null) => {
    const sql = `
            INSERT INTO order_items (order_id, product_id, quantity, unit_price_at_sale)
            VALUES ?
        `;
    const values = items.map((item) => [
      item.order_id,
      item.product_id,
      item.quantity,
      item.unit_price_at_sale,
    ]);

    // Use provided connection for transaction, or create new query
    if (connection) {
      const [result] = await connection.query(sql, [values]);
      return result;
    } else {
      const [result] = await db.promise().query(sql, [values]);
      return result;
    }
  },

  // Get order items by order_id
  getByOrderId: async (orderId) => {
    const sql = `
            SELECT 
                oi.*,
                p.name AS product_name,
                p.image_url AS product_image,
                p.category AS product_category
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ?
            ORDER BY oi.order_item_id ASC
        `;
    const [rows] = await db.promise().query(sql, [orderId]);
    return rows;
  },

  // Get order item by ID
  getById: async (orderItemId) => {
    const sql = `SELECT * FROM order_items WHERE order_item_id = ?`;
    const [rows] = await db.promise().query(sql, [orderItemId]);
    return rows[0];
  },

  // Delete order item (for cart management)
  delete: async (orderItemId) => {
    const sql = `DELETE FROM order_items WHERE order_item_id = ?`;
    const [result] = await db.promise().query(sql, [orderItemId]);
    return result;
  },

  // Delete all items for an order (used when order is cancelled)
  deleteByOrderId: async (orderId) => {
    const sql = `DELETE FROM order_items WHERE order_id = ?`;
    const [result] = await db.promise().query(sql, [orderId]);
    return result;
  },
};

module.exports = OrderItem;

