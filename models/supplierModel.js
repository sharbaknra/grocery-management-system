const db = require("../config/db");

const Supplier = {
  create: async (data) => {
    const sql = `
      INSERT INTO suppliers
      (name, contact_name, phone, email, address, lead_time_days, min_order_amount, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      data.name,
      data.contact_name || null,
      data.phone || null,
      data.email || null,
      data.address || null,
      data.lead_time_days ?? 7,
      data.min_order_amount ?? 0,
      data.notes || null,
    ];
    const [result] = await db.promise().query(sql, values);
    return result.insertId;
  },

  update: async (id, data) => {
    const sql = `
      UPDATE suppliers SET
        name = ?,
        contact_name = ?,
        phone = ?,
        email = ?,
        address = ?,
        lead_time_days = ?,
        min_order_amount = ?,
        notes = ?
      WHERE id = ?
    `;
    const values = [
      data.name,
      data.contact_name || null,
      data.phone || null,
      data.email || null,
      data.address || null,
      data.lead_time_days ?? 7,
      data.min_order_amount ?? 0,
      data.notes || null,
      id,
    ];
    const [result] = await db.promise().query(sql, values);
    return result;
  },

  delete: async (id) => {
    const sql = `DELETE FROM suppliers WHERE id = ?`;
    const [result] = await db.promise().query(sql, [id]);
    return result;
  },

  getAllWithStats: async () => {
    const sql = `
      SELECT 
        s.*,
        COUNT(DISTINCT p.id) AS product_count,
        COALESCE(SUM(CASE WHEN st.quantity <= st.min_stock_level AND st.min_stock_level > 0 THEN 1 ELSE 0 END), 0) AS low_stock_items
      FROM suppliers s
      LEFT JOIN products p ON p.supplier_id = s.id
      LEFT JOIN stock st ON st.product_id = p.id
      GROUP BY s.id
      ORDER BY s.name ASC
    `;
    const [rows] = await db.promise().query(sql);
    return rows;
  },

  getById: async (id) => {
    const sql = `SELECT * FROM suppliers WHERE id = ?`;
    const [rows] = await db.promise().query(sql, [id]);
    return rows[0];
  },

  getProductsForSupplier: async (supplierId) => {
    const sql = `
      SELECT 
        p.id AS product_id,
        p.name,
        p.category,
        p.price,
        p.barcode,
        p.expiry_date,
        s.quantity,
        s.min_stock_level,
        (s.min_stock_level - s.quantity) AS shortage
      FROM products p
      LEFT JOIN stock s ON p.id = s.product_id
      WHERE p.supplier_id = ?
      ORDER BY p.name ASC
    `;
    const [rows] = await db.promise().query(sql, [supplierId]);
    return rows;
  },

  getOrderHistoryForSupplier: async (supplierId, limit = 25) => {
    const sql = `
      SELECT 
        o.order_id,
        o.created_at,
        o.status,
        u.name AS customer_name,
        COALESCE(SUM(oi.quantity), 0) AS total_units,
        COALESCE(SUM(oi.quantity * oi.unit_price_at_sale), 0) AS total_value
      FROM orders o
      INNER JOIN order_items oi ON o.order_id = oi.order_id
      INNER JOIN products p ON oi.product_id = p.id
      LEFT JOIN users u ON o.user_id = u.id
      WHERE p.supplier_id = ?
      GROUP BY o.order_id, o.created_at, o.status, u.name
      ORDER BY o.created_at DESC
      LIMIT ?
    `;
    const [rows] = await db.promise().query(sql, [supplierId, limit]);
    return rows;
  },

  getReorderList: async (supplierId = null) => {
    const params = [];
    const supplierFilter = supplierId ? "AND sup.id = ?" : "";
    if (supplierId) {
      params.push(supplierId);
    }

    const sql = `
      SELECT
        sup.id AS supplier_id,
        sup.name AS supplier_name,
        sup.contact_name,
        sup.phone,
        sup.email,
        sup.lead_time_days,
        sup.min_order_amount,
        p.id AS product_id,
        p.name AS product_name,
        p.category,
        s.quantity,
        s.min_stock_level,
        (s.min_stock_level - s.quantity) AS shortage,
        GREATEST((s.min_stock_level * 2) - s.quantity, s.min_stock_level - s.quantity, 0) AS suggested_order_quantity
      FROM suppliers sup
      INNER JOIN products p ON p.supplier_id = sup.id
      INNER JOIN stock s ON s.product_id = p.id
      WHERE s.min_stock_level > 0
        AND s.quantity <= s.min_stock_level
        ${supplierFilter}
      ORDER BY sup.name ASC, shortage DESC
    `;
    const [rows] = await db.promise().query(sql, params);
    return rows;
  },
};

module.exports = Supplier;

