const Product = require("../models/productModel");

// ========================
// CREATE PRODUCT
// ========================
exports.createProduct = (req, res) => {
    const imageUrl = req.file ? req.file.filename : null;
    const data = {
        ...req.body,
        image_url: imageUrl,
    };

    Product.createProduct(data, (err, result) => {
        if (err) {
            console.error("Error creating product:", err);
            return res.status(500).json({ message: "Database error", error: err });
        }

        res.status(201).json({
            message: "Product created successfully",
            productId: result.insertId,
        });
    });
};

// ========================
// GET ALL PRODUCTS
// ========================
exports.getAllProducts = (req, res) => {
    Product.getAllProducts((err, products) => {
        if (err) {
            console.error("Error fetching products:", err);
            return res.status(500).json({ message: "Database error" });
        }

        res.json(products);
    });
};

// ========================
// GET PRODUCT BY ID
// ========================
exports.getProductById = (req, res) => {
    const id = req.params.id;

    Product.getProductById(id, (err, product) => {
        if (err) {
            console.error("Error fetching product:", err);
            return res.status(500).json({ message: "Database error" });
        }

        if (product.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product[0]);
    });
};

// ========================
// UPDATE PRODUCT
// ========================
exports.updateProduct = (req, res) => {
    const id = req.params.id;
    const incomingBody = req.body || {};

    Product.getProductById(id, (fetchErr, product) => {
        if (fetchErr) {
            console.error("Error fetching product for update:", fetchErr);
            return res.status(500).json({ message: "Database error" });
        }

        if (!product || product.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        const existing = product[0];
        const mergedData = {
            name: incomingBody.name ?? existing.name,
            category: incomingBody.category ?? existing.category,
            price: incomingBody.price ?? existing.price,
            quantity: incomingBody.quantity ?? existing.quantity,
            barcode: incomingBody.barcode ?? existing.barcode,
            description: incomingBody.description ?? existing.description,
            expiry_date: incomingBody.expiry_date ?? existing.expiry_date,
            supplier: incomingBody.supplier ?? existing.supplier,
            image_url: req.file
                ? req.file.filename
                : incomingBody.image_url ?? existing.image_url,
        };

        Product.updateProduct(id, mergedData, (err, result) => {
            if (err) {
                console.error("Error updating product:", err);
                return res.status(500).json({ message: "Database error" });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Product not found" });
            }

            res.json({ message: "Product updated successfully" });
        });
    });
};

// ========================
// DELETE PRODUCT
// ========================
exports.deleteProduct = (req, res) => {
    const id = req.params.id;

    Product.deleteProduct(id, (err, result) => {
        if (err) {
            console.error("Error deleting product:", err);
            return res.status(500).json({ message: "Database error" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: "Product deleted successfully" });
    });
};

// ========================
// SEARCH PRODUCTS
// ========================
exports.searchProducts = (req, res) => {
    const search = req.query.name || "";

    Product.searchProducts(search, (err, products) => {
        if (err) {
            console.error("Error searching products:", err);
            return res.status(500).json({ message: "Database error" });
        }

        res.json(products);
    });
};

// ========================
// FILTER BY CATEGORY
// ========================
exports.filterByCategory = (req, res) => {
    const category = req.query.category;

    Product.filterByCategory(category, (err, products) => {
        if (err) {
            console.error("Error filtering products:", err);
            return res.status(500).json({ message: "Database error" });
        }

        res.json(products);
    });
};

// ========================
// FILTER BY PRICE RANGE
// ========================
exports.filterByPrice = (req, res) => {
    const min = req.query.min || 0;
    const max = req.query.max || 999999;

    Product.filterByPrice(min, max, (err, products) => {
        if (err) {
            console.error("Error filtering products:", err);
            return res.status(500).json({ message: "Database error" });
        }

        res.json(products);
    });
};

