const db = require("../config/db");

const Cart = {
  // Add item to cart (or update quantity if already exists)
  addItem: async (userId, productId, quantity) => {
    const connection = await db.promise().getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Check if item already exists in cart
      const [existing] = await connection.query(
        'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
        [userId, productId]
      );
      
      if (existing.length > 0) {
        // Update quantity if item exists
        await connection.query(
          'UPDATE cart SET quantity = quantity + ?, updated_at = NOW() WHERE user_id = ? AND product_id = ?',
          [quantity, userId, productId]
        );
        const [updated] = await connection.query(
          'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
          [userId, productId]
        );
        await connection.commit();
        return updated[0];
      } else {
        // Insert new cart item
        const [result] = await connection.query(
          'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
          [userId, productId, quantity]
        );
        const [newItem] = await connection.query(
          'SELECT * FROM cart WHERE cart_id = ?',
          [result.insertId]
        );
        await connection.commit();
        return newItem[0];
      }
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Get all cart items for a user
  getByUserId: async (userId) => {
    const sql = `
            SELECT 
                c.*,
                p.name AS product_name,
                p.price AS current_price,
                p.image_url AS product_image,
                p.category AS product_category,
                s.quantity AS available_stock
            FROM cart c
            JOIN products p ON c.product_id = p.id
            LEFT JOIN stock s ON c.product_id = s.product_id
            WHERE c.user_id = ?
            ORDER BY c.created_at DESC
        `;
    const [rows] = await db.promise().query(sql, [userId]);
    return rows;
  },

  // Get single cart item
  getItem: async (userId, productId) => {
    const sql = `
            SELECT 
                c.*,
                p.name AS product_name,
                p.price AS current_price,
                s.quantity AS available_stock
            FROM cart c
            JOIN products p ON c.product_id = p.id
            LEFT JOIN stock s ON c.product_id = s.product_id
            WHERE c.user_id = ? AND c.product_id = ?
        `;
    const [rows] = await db.promise().query(sql, [userId, productId]);
    return rows[0];
  },

  // Update cart item quantity
  updateQuantity: async (userId, productId, quantity) => {
    const sql = `
            UPDATE cart 
            SET quantity = ?, updated_at = NOW()
            WHERE user_id = ? AND product_id = ?
        `;
    const [result] = await db.promise().query(sql, [quantity, userId, productId]);
    return result;
  },

  // Remove item from cart
  removeItem: async (userId, productId) => {
    const sql = 'DELETE FROM cart WHERE user_id = ? AND product_id = ?';
    const [result] = await db.promise().query(sql, [userId, productId]);
    return result;
  },

  // Clear entire cart for a user
  clearCart: async (userId) => {
    const sql = 'DELETE FROM cart WHERE user_id = ?';
    const [result] = await db.promise().query(sql, [userId]);
    return result;
  },

  // Get cart count (total items in cart)
  getCartCount: async (userId) => {
    const sql = 'SELECT SUM(quantity) AS total_items FROM cart WHERE user_id = ?';
    const [rows] = await db.promise().query(sql, [userId]);
    return rows[0].total_items || 0;
  },
};

module.exports = Cart;

