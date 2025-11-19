const db = require("../config/db");

// ========================
// CREATE PRODUCT
// ========================
exports.createProduct = (data, callback) => {
    const sql = `
        INSERT INTO products 
        (name, category, price, quantity, barcode, description, expiry_date, supplier, image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
        data.name,
        data.category,
        data.price,
        data.quantity,
        data.barcode,
        data.description,
        data.expiry_date,
        data.supplier,
        data.image_url
    ];
    db.query(sql, values, callback);
};

// ========================
// GET ALL PRODUCTS
// ========================
exports.getAllProducts = (callback) => {
    const sql = `SELECT * FROM products ORDER BY created_at DESC`;
    db.query(sql, callback);
};

// ========================
// GET PRODUCT BY ID
// ========================
exports.getProductById = (id, callback) => {
    const sql = `SELECT * FROM products WHERE id = ?`;
    db.query(sql, [id], callback);
};

// ========================
// UPDATE PRODUCT
// ========================
exports.updateProduct = (id, data, callback) => {
    const sql = `
        UPDATE products SET 
        name = ?, category = ?, price = ?, quantity = ?, 
        barcode = ?, description = ?, expiry_date = ?, 
        supplier = ?, image_url = ?
        WHERE id = ?
    `;
    const values = [
        data.name,
        data.category,
        data.price,
        data.quantity,
        data.barcode,
        data.description,
        data.expiry_date,
        data.supplier,
        data.image_url,
        id
    ];
    db.query(sql, values, callback);
};

// ========================
// DELETE PRODUCT
// ========================
exports.deleteProduct = (id, callback) => {
    const sql = `DELETE FROM products WHERE id = ?`;
    db.query(sql, [id], callback);
};

// ========================
// SEARCH BY NAME
// ========================
exports.searchProducts = (searchTerm, callback) => {
    const sql = `
        SELECT * FROM products 
        WHERE name LIKE ?
        ORDER BY created_at DESC
    `;
    db.query(sql, [`%${searchTerm}%`], callback);
};

// ========================
// FILTER BY CATEGORY
// ========================
exports.filterByCategory = (category, callback) => {
    const sql = `SELECT * FROM products WHERE category = ?`;
    db.query(sql, [category], callback);
};

// ========================
// FILTER BY PRICE RANGE
// ========================
exports.filterByPrice = (minPrice, maxPrice, callback) => {
    const sql = `
        SELECT * FROM products 
        WHERE price BETWEEN ? AND ?
        ORDER BY price ASC
    `;
    db.query(sql, [minPrice, maxPrice], callback);
};

// ========================
// EXPIRY FILTER (Optional)
// ========================
exports.getExpiringSoon = (days, callback) => {
    const sql = `
        SELECT * FROM products 
        WHERE expiry_date <= DATE_ADD(CURDATE(), INTERVAL ? DAY)
        ORDER BY expiry_date ASC
    `;
    db.query(sql, [days], callback);
};

