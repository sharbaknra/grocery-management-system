const db = require("../config/db");

const mapProductRow = (row) => {
  if (!row) return null;
  return {
    ...row,
    supplier_id: row.supplier_id || null,
    supplier_name: row.supplier_name || null,
    supplier_contact_name: row.supplier_contact_name || null,
    supplier_phone: row.supplier_phone || null,
    supplier_email: row.supplier_email || null,
    supplier: row.supplier_name || null, // backwards compatibility for legacy clients
  };
};

const baseSelect = `
  SELECT 
    p.*,
    s.quantity,
    s.min_stock_level,
    sup.id AS supplier_id,
    sup.name AS supplier_name,
    sup.contact_name AS supplier_contact_name,
    sup.phone AS supplier_phone,
    sup.email AS supplier_email
  FROM products p
  LEFT JOIN stock s ON p.id = s.product_id
  LEFT JOIN suppliers sup ON p.supplier_id = sup.id
`;

const Product = {
  create: async (data) => {
    const sql = `
            INSERT INTO products 
            (name, category, price, barcode, description, expiry_date, supplier_id, image_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
    const values = [
      data.name,
      data.category,
      data.price,
      data.barcode || null,
      data.description || null,
      data.expiry_date || null, // Convert empty string to null
      data.supplier_id || null,
      data.image_url || null,
    ];
    const [result] = await db.promise().query(sql, values);
    return result.insertId;
  },

  getAll: async () => {
    const sql = `${baseSelect} ORDER BY p.created_at DESC`;
    const [rows] = await db.promise().query(sql);
    return rows.map(mapProductRow);
  },

  getById: async (id) => {
    const sql = `${baseSelect} WHERE p.id = ?`;
    const [rows] = await db.promise().query(sql, [id]);
    return mapProductRow(rows[0]);
  },

  search: async (searchTerm) => {
    const sql = `${baseSelect} WHERE LOWER(p.name) LIKE LOWER(?) ORDER BY p.created_at DESC`;
    const [rows] = await db.promise().query(sql, [`%${searchTerm}%`]);
    return rows.map(mapProductRow);
  },

  update: async (id, data) => {
    const sql = `
            UPDATE products SET 
            name = ?, category = ?, price = ?, barcode = ?, 
            description = ?, expiry_date = ?, supplier_id = ?, image_url = ?
            WHERE id = ?
        `;
    const values = [
      data.name,
      data.category,
      data.price,
      data.barcode || null,
      data.description || null,
      data.expiry_date || null, // Convert empty string to null
      data.supplier_id || null,
      data.image_url || null,
      id,
    ];
    const [result] = await db.promise().query(sql, values);
    return result;
  },

  delete: async (id) => {
    const sql = `DELETE FROM products WHERE id = ?`;
    const [result] = await db.promise().query(sql, [id]);
    return result;
  },

  filterByCategory: async (category) => {
    const sql = `${baseSelect} WHERE p.category = ?`;
    const [rows] = await db.promise().query(sql, [category]);
    return rows.map(mapProductRow);
  },

  filterByPrice: async (minPrice, maxPrice) => {
    const sql = `${baseSelect} WHERE p.price BETWEEN ? AND ?`;
    const [rows] = await db.promise().query(sql, [minPrice, maxPrice]);
    return rows.map(mapProductRow);
  },

  searchWithFilters: async (searchTerm, category) => {
    let sql = baseSelect;
    const conditions = [];
    const values = [];

    if (searchTerm) {
      conditions.push("LOWER(p.name) LIKE LOWER(?)");
      values.push(`%${searchTerm}%`);
    }

    if (category) {
      conditions.push("p.category = ?");
      values.push(category);
    }

    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(" AND ")}`;
    }

    sql += " ORDER BY p.created_at DESC";
    const [rows] = await db.promise().query(sql, values);
    return rows.map(mapProductRow);
  },
};

module.exports = Product;
