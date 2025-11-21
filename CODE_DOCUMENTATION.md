# Grocery Management System - Code Documentation

## Project Overview
This document provides a comprehensive overview of the codebase for the Grocery Management System. It includes the directory structure and detailed documentation for every file in the project, including the full source code.

## Directory Structure
```
grocery-management-system/
├── config/
│   └── db.js
├── controllers/
│   ├── cartController.js
│   ├── checkoutController.js
│   ├── itemController.js
│   ├── orderHistoryController.js
│   ├── productController.js
│   ├── stockController.js
│   └── userController.js
├── database/
│   ├── create-cart-table.sql
│   ├── create-order-history-indexes.sql
│   └── create-orders-tables.sql
├── middleware/
│   ├── adminMiddleware.js
│   ├── authMiddleware.js
│   ├── roleMiddleware.js
│   └── uploadMiddleware.js
├── models/
│   ├── cartModel.js
│   ├── itemModel.js
│   ├── orderItemModel.js
│   ├── orderModel.js
│   ├── productModel.js
│   ├── stockModel.js
│   └── userModel.js
├── routes/
│   ├── cartRoutes.js
│   ├── itemRoutes.js
│   ├── orderRoutes.js
│   ├── productRoutes.js
│   ├── stockRoutes.js
│   └── userRoutes.js
├── utils/
│   └── tokenBlacklist.js
└── server.js
```

## Root Directory

### `server.js`
**Description**: The entry point of the application. It sets up the Express server, middleware (CORS, JSON parsing, static file serving), connects to the database, defines routes, handles errors, and starts the server.

**Code**:
```javascript
// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const db = require('./config/db'); // MySQL connection
const itemRoutes = require('./routes/itemRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const stockRoutes = require('./routes/stockRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const User = require('./models/userModel');

const app = express();

// === MIDDLEWARE ===
app.use(cors());
app.use(express.json()); // ✅ Enables JSON body parsing
app.use('/uploads', express.static('uploads'));

// === ROUTES ===
app.use('/api/items', itemRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/orders/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// === ERROR HANDLING MIDDLEWARE ===
app.use((err, req, res, next) => {
  // Handle JSON parse errors (malformed JSON in request body)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('JSON parse error:', err.message);
    return res.status(400).json({ 
      message: 'Invalid JSON format in request body',
      error: 'Malformed JSON. Please check your request body syntax.'
    });
  }

  // Handle multer file upload errors
  if (err.name === 'MulterError') {
    console.error('File upload error:', err.message);
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        message: 'File too large',
        error: 'File size exceeds the 3MB limit.'
      });
    }
    return res.status(400).json({ 
      message: 'File upload error',
      error: err.message 
    });
  }

  // Handle all other errors
  console.error('Unhandled error:', err);
  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({ 
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Seed admin user on server start
User.seedAdmin();

// === SERVER START ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

**Key Updates (Module 2.9.5):**
- Added `stockRoutes`, `cartRoutes`, and `orderRoutes` imports
- Registered routes: `/api/stock`, `/api/orders/cart`, `/api/orders`

## Config

### `config/db.js`
**Description**: Configures and exports the MySQL database connection pool. It uses environment variables for credentials and supports both callback and promise-based queries.

**Code**:
```javascript
// config/db.js

const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config(); // loads .env variables into process.env

// create a connection pool (better for multiple queries)
const pool = mysql.createPool({
  host: process.env.DB_HOST,      // localhost
  user: process.env.DB_USER,      // root
  password: process.env.DB_PASSWORD, // worstnightmare
  database: process.env.DB_NAME,  // grocery_db
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// check the connection once at startup
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ MySQL connection failed:', err.message);
  } else {
    console.log('✅ Connected to MySQL successfully!');
    connection.release();
  }
});

// export pool directly to support both callbacks and promises
// For callbacks: db.query(sql, params, callback)
// For promises: db.promise().query(sql, params)
module.exports = pool;
```

## Models

### `models/userModel.js`
**Description**: Handles database operations for users, including creation, finding by email, getting all users, and seeding the default admin user.

**Code**:
```javascript
// models/userModel.js
const db = require('../config/db');
const bcrypt = require('bcrypt');

const User = {
  // Create new user
  create: async (userData) => {
    const { name, email, password } = userData;
    const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    const [result] = await db.promise().query(sql, [name, email, password]);
    return { id: result.insertId, name, email };
  },

  // Find user by email
  findByEmail: async (email) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await db.promise().query(sql, [email]);
    return rows;
  },

  // Get all users (excluding passwords ideally)
  getAll: async () => {
    const sql = 'SELECT id, name, email, role, created_at FROM users';
    const [rows] = await db.promise().query(sql);
    return rows;
  },

  // Seed admin user
  seedAdmin: async () => {
    const adminEmail = 'admin@grocery.com';
    const adminPassword = 'admin123';

    try {
      // Check if admin already exists
      const [existing] = await db.promise().query('SELECT * FROM users WHERE email = ?', [adminEmail]);
      
      if (existing.length === 0) {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        await db.promise().query(
          'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
          ['Admin', adminEmail, hashedPassword, 'admin']
        );
        console.log('✅ Default admin created:', adminEmail);
      } else {
        console.log('ℹ️ Admin already exists:', adminEmail);
      }
    } catch (err) {
      console.error('❌ Error seeding admin:', err);
    }
  }
};

module.exports = User;
```

### `models/productModel.js`
**Description**: Handles database operations for products. It joins with the `stock` table to retrieve quantity information. Supports CRUD operations, searching, and filtering.

**Code**:
```javascript
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
```

### `models/itemModel.js`
**Description**: Handles database operations for the simpler 'items' table (likely a legacy or secondary item list). Supports basic CRUD operations.

**Code**:
```javascript
// models/itemModel.js

const db = require('../config/db');

// All queries related to "items" table
const Item = {
  // Get all items
  getAll: async () => {
    const [rows] = await db.promise().query('SELECT * FROM items');
    return rows;
  },

  // Get single item by ID
  getById: async (id) => {
    const [rows] = await db.promise().query('SELECT * FROM items WHERE id = ?', [id]);
    return rows[0];
  },

  // Add a new item
  create: async (data) => {
    const { name, category, price, quantity } = data;
    const [result] = await db.promise().query(
      'INSERT INTO items (name, category, price, quantity) VALUES (?, ?, ?, ?)',
      [name, category, price, quantity]
    );
    return { id: result.insertId, ...data };
  },

  // Update an item
  update: async (id, data) => {
    const { name, category, price, quantity } = data;
    await db.promise().query(
      'UPDATE items SET name = ?, category = ?, price = ?, quantity = ? WHERE id = ?',
      [name, category, price, quantity, id]
    );
    return { id, ...data };
  },

  // Delete an item
  delete: async (id) => {
    await db.promise().query('DELETE FROM items WHERE id = ?', [id]);
    return { message: 'Item deleted successfully' };
  },
};

module.exports = Item;
```

### `models/stockModel.js`
**Description**: Handles database operations for the `stock` table, which tracks product quantities. Supports creating stock entries, fetching by product ID, updating quantity, and finding low stock items.

**Code**:
```javascript
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
```

## Controllers

### `controllers/userController.js`
**Description**: Handles user-related requests such as registration, login (with JWT generation), and fetching all users.

**Code**:
```javascript
// controllers/userController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const userController = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
      }

      // check if user exists
      const existingUsers = await User.findByEmail(email);
      if (existingUsers.length > 0) {
        return res.status(400).json({ message: 'Email already registered.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({ name, email, password: hashedPassword });
      
      res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
      }

      const result = await User.findByEmail(email);
      if (result.length === 0) return res.status(404).json({ message: 'User not found.' });

      const user = result[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.status(200).json({ message: 'Login successful!', token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const users = await User.getAll();
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }
};

module.exports = userController;
```

### `controllers/productController.js`
**Description**: Handles product-related requests. It coordinates with both `Product` and `Stock` models to ensure data integrity (e.g., creating stock when a product is created, deleting stock when a product is deleted).

**Code**:
```javascript
const Product = require("../models/productModel");
const Stock = require("../models/stockModel"); // <<< Import the new Stock Model

const productController = {
  // CREATE PRODUCT + INITIALIZE STOCK (Updated for 2.8.1)
  createProduct: async (req, res) => {
    try {
      const imageUrl = req.file ? req.file.filename : null;
      // Separate quantity from product details
      const { quantity, ...productData } = req.body;
      const initialStock = quantity || 0;

      const data = { ...productData, image_url: imageUrl };

      // 1. Create Product (only details)
      const productId = await Product.create(data);

      // 2. Initialize Stock record using the new Stock model
      await Stock.create(productId, initialStock);

      res.status(201).json({
        message: "Product created successfully",
        productId: productId,
      });
    } catch (err) {
      console.error("Error creating product:", err);
      res.status(500).json({ message: "Database error", error: err.message });
    }
  },

  // ... All other functions are unchanged, as the model now handles fetching quantity ...

  getAllProducts: async (req, res) => {
    try {
      const { 
        name, 
        category, 
        minPrice, 
        maxPrice 
      } = req.query;

      // 1) Search by name
      if (name) {
        const products = await Product.search(name);
        return res.status(200).json(products);
      }

      // 2) Filter by category
      if (category) {
        const products = await Product.filterByCategory(category);
        return res.status(200).json(products);
      }

      // 3) Filter by price range
      if (minPrice && maxPrice) {
        const min = parseFloat(minPrice);
        const max = parseFloat(maxPrice);

        if (isNaN(min) || isNaN(max)) {
          return res.status(400).json({ message: "Invalid price range" });
        }

        const products = await Product.filterByPrice(min, max);
        return res.status(200).json(products);
      }

      // 4) Default: return all products
      const products = await Product.getAll();
      res.status(200).json(products);

    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  getProductById: async (req, res) => {
    try {
      const product = await Product.getById(req.params.id);
      if (!product) return res.status(404).json({ message: "Product not found" });
      res.json(product);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Database error" });
    }
  },

  searchProducts: async (req, res) => {
    try {
      const products = await Product.search(req.query.name || "");
      res.json(products);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Database error" });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const id = req.params.id;
      const existing = await Product.getById(id);
      if (!existing) return res.status(404).json({ message: "Product not found" });

      const incoming = req.body;
      const mergedData = {
        name: incoming.name ?? existing.name,
        category: incoming.category ?? existing.category,
        price: incoming.price ?? existing.price,
        barcode: incoming.barcode ?? existing.barcode,
        description: incoming.description ?? existing.description,
        expiry_date: incoming.expiry_date ?? existing.expiry_date,
        supplier: incoming.supplier ?? existing.supplier,
        image_url: req.file ? req.file.filename : incoming.image_url ?? existing.image_url,
      };

      await Product.update(id, mergedData);
      res.json({ message: "Product updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Database error" });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const id = req.params.id;
      
      // CRITICAL: Delete stock entry first to maintain data integrity
      // This ensures no orphaned stock records exist when product is deleted
      await Stock.deleteByProductId(id);
      
      // Then delete the product
      const result = await Product.delete(id);
      if (result.affectedRows === 0) return res.status(404).json({ message: "Product not found" });
      res.json({ message: "Product deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Database error" });
    }
  },
};

module.exports = productController;
```

### `controllers/itemController.js`
**Description**: Handles requests for the 'items' resource. Supports standard CRUD operations.

**Code**:
```javascript
// controllers/itemController.js
const Item = require('../models/itemModel');

const itemController = {
  // Get all items
  getAll: async (req, res) => {
    try {
      const items = await Item.getAll();
      res.json(items);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Create a new item
  create: async (req, res) => {
    try {
      const { name, category, price, quantity } = req.body;
      if (!name || price === undefined) {
        return res.status(400).json({ message: 'Name and price are required.' });
      }
      const newItem = await Item.create({
        name,
        category: category || null,
        price,
        quantity: quantity || 0,
      });
      res.status(201).json({ message: 'Item added successfully!', item: newItem });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Update an existing item
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, category, price, quantity } = req.body;
      if (!name || price === undefined) {
        return res.status(400).json({ message: 'Name and price are required.' });
      }
      const updated = await Item.update(id, {
        name,
        category: category || null,
        price,
        quantity: quantity || 0,
      });
      res.json({ message: 'Item updated successfully!', item: updated });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Delete an item
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await Item.delete(id);
      res.json({ message: 'Item deleted successfully!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  },
};

module.exports = itemController;
```

## Middleware

### `middleware/authMiddleware.js`
**Description**: Verifies the JWT token in the `Authorization` header. If valid, attaches the decoded user data to `req.user`.

**Code**:
```javascript
// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // No token?
  if (!authHeader) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  // Expected format: "Bearer <token>"
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Invalid token format.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach decoded user data
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = verifyToken;
```

### `middleware/adminMiddleware.js`
**Description**: Checks if the authenticated user has the 'admin' role. Must be used after `authMiddleware`.

**Code**:
```javascript
// middleware/adminMiddleware.js

const verifyAdmin = (req, res, next) => {
  // verifyToken should have already run before this!
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized. No user data found.' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access forbidden. Admins only.' });
  }

  next();
};

module.exports = verifyAdmin;
```

### `middleware/roleMiddleware.js`
**Description**: Middleware for role-based access control. Checks if the authenticated user's role is in the allowed roles list. Returns 403 Forbidden if the user's role is not in the allowed roles. Used for flexible role-based authorization (customer, admin, staff).

**Code**:
```javascript
const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized. No user data found." });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access forbidden. Insufficient privileges." });
    }

    return next();
  };
};

module.exports = allowRoles;
```

### `middleware/uploadMiddleware.js`
**Description**: Configures `multer` for handling file uploads. Sets the destination folder, filename format, file size limit (3MB), and file type filter (images only).

**Code**:
```javascript
const multer = require("multer");
const path = require("path");

// Storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"));
    },
});

// File filter
const fileFilter = (req, file, cb) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only JPG, PNG, WEBP allowed."), false);
    }
};

// Upload object
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 3 * 1024 * 1024, // 3MB
    },
    fileFilter: fileFilter,
});

module.exports = upload;
```

## Routes

### `routes/userRoutes.js`
**Description**: Defines routes for user operations. Includes public routes for register/login and protected admin routes for listing users.

**Code**:
```javascript
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware');
const verifyAdmin = require('../middleware/adminMiddleware');

// public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// admin-only route
router.get('/', verifyToken, verifyAdmin, userController.getAllUsers);

module.exports = router;
```

### `routes/productRoutes.js`
**Description**: Defines routes for product operations. Includes routes for creating, reading, updating, and deleting products, with appropriate authentication and file upload middleware.

**Code**:
```javascript
const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const auth = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");

// CREATE PRODUCT
router.post(
    "/add",
    auth,
    adminOnly,
    upload.single("image"),
    productController.createProduct
);

// GET ALL PRODUCTS
router.get("/", auth, productController.getAllProducts);

// SEARCH PRODUCTS
router.get("/search", auth, productController.searchProducts);

// GET PRODUCT BY ID
router.get("/:id", auth, productController.getProductById);

// UPDATE PRODUCT
router.put(
    "/update/:id",
    auth,
    adminOnly,
    upload.single("image"),
    productController.updateProduct
);

// DELETE PRODUCT
router.delete("/delete/:id", auth, adminOnly, productController.deleteProduct);

module.exports = router;
```

### `routes/itemRoutes.js`
**Description**: Defines routes for item operations. Includes public read access and admin-only write access.

**Code**:
```javascript
const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const verifyToken = require('../middleware/authMiddleware');
const verifyAdmin = require('../middleware/adminMiddleware');

// public
router.get('/', itemController.getAll);

// admin-only
router.post('/', verifyToken, verifyAdmin, itemController.create);
router.put('/:id', verifyToken, verifyAdmin, itemController.update);
router.delete('/:id', verifyToken, verifyAdmin, itemController.delete);

module.exports = router;
```

## Utils

### `utils/tokenBlacklist.js`
**Description**: A simple in-memory store for blacklisted tokens (not currently actively used in the main flow but available for logout implementation).

**Code**:
```javascript
// utils/tokenBlacklist.js
// In-memory token blacklist store
// Note: This resets on server restart. For production, consider Redis, MongoDB, or PostgreSQL.

const tokenBlacklist = [];

module.exports = { tokenBlacklist };
```

---

## Module 2.9.5: Order History

### `models/orderModel.js`
**Description**: Model for managing orders. Includes methods for creating orders, retrieving orders by ID or user ID, getting all orders (for admin), and updating order status. Enhanced for Module 2.9.5 to include complex JOIN operations with users table.

**Code**:
```javascript
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
```

### `models/orderItemModel.js`
**Description**: Model for managing order items. Includes methods for creating order items (single and multiple), retrieving items by order ID (with product JOIN), and deleting items. Critical for maintaining unit_price_at_sale for audit trails.

**Code**:
```javascript
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

  // Get order items by order_id (with product JOIN)
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
```

### `controllers/orderHistoryController.js`
**Description**: Controller for order history operations. Implements three endpoints: (1) GET /api/orders - Get all orders (Admin/Staff only), (2) GET /api/orders/me - Get customer's own orders, (3) GET /api/orders/:orderId - Get single order by ID. Uses complex JOIN operations across orders, users, and order_items tables for comprehensive data aggregation. Includes unit_price_at_sale for audit trails.

**Code**:
```javascript
const Order = require("../models/orderModel");
const OrderItem = require("../models/orderItemModel");

const orderHistoryController = {
  // GET /api/orders (Admin/Staff only) - Get all orders
  getAllOrders: async (req, res) => {
    // Additional authorization check (defense in depth)
    // The middleware should block customers, but this adds an extra check
    const userRole = req.user?.role;
    
    if (userRole !== "admin" && userRole !== "staff") {
      return res.status(403).json({
        success: false,
        message: "Access forbidden. Insufficient privileges. Only Admin and Staff can view all orders.",
      });
    }
    
    try {
      // Get all orders with user information
      const orders = await Order.getAll();

      // Fetch order items for each order
      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          const items = await OrderItem.getByOrderId(order.order_id);
          return {
            ...order,
            items: items.map((item) => ({
              order_item_id: item.order_item_id,
              product_id: item.product_id,
              product_name: item.product_name,
              product_image: item.product_image,
              product_category: item.product_category,
              quantity: item.quantity,
              unit_price_at_sale: parseFloat(item.unit_price_at_sale), // Critical: price at time of sale
              item_total: parseFloat(item.unit_price_at_sale) * item.quantity,
            })),
            item_count: items.length,
          };
        })
      );

      res.status(200).json({
        success: true,
        data: {
          orders: ordersWithItems,
          total_orders: ordersWithItems.length,
        },
      });
    } catch (error) {
      console.error("Error fetching all orders:", error);
      res.status(500).json({
        success: false,
        message: "Server error while fetching orders.",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // GET /api/orders/me (Customer access only) - Get customer's own orders
  getMyOrders: async (req, res) => {
    try {
      const userId = req.user.id;

      // Get user's orders
      const orders = await Order.getByUserId(userId);

      // Fetch order items for each order
      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          const items = await OrderItem.getByOrderId(order.order_id);
          return {
            ...order,
            items: items.map((item) => ({
              order_item_id: item.order_item_id,
              product_id: item.product_id,
              product_name: item.product_name,
              product_image: item.product_image,
              product_category: item.product_category,
              quantity: item.quantity,
              unit_price_at_sale: parseFloat(item.unit_price_at_sale), // Critical: price at time of sale
              item_total: parseFloat(item.unit_price_at_sale) * item.quantity,
            })),
            item_count: items.length,
          };
        })
      );

      res.status(200).json({
        success: true,
        data: {
          orders: ordersWithItems,
          total_orders: ordersWithItems.length,
        },
      });
    } catch (error) {
      console.error("Error fetching user orders:", error);
      res.status(500).json({
        success: false,
        message: "Server error while fetching your orders.",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // GET /api/orders/:orderId - Get single order by ID
  getOrderById: async (req, res) => {
    try {
      const { orderId } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;

      // Get order
      const order = await Order.getById(parseInt(orderId));

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found.",
        });
      }

      // Check authorization: Admin/Staff can see any order, Customers can only see their own
      if (userRole !== "admin" && userRole !== "staff" && order.user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: "Access forbidden. You can only view your own orders.",
        });
      }

      // Get order items
      const items = await OrderItem.getByOrderId(parseInt(orderId));

      const orderWithItems = {
        ...order,
        items: items.map((item) => ({
          order_item_id: item.order_item_id,
          product_id: item.product_id,
          product_name: item.product_name,
          product_image: item.product_image,
          product_category: item.product_category,
          quantity: item.quantity,
          unit_price_at_sale: parseFloat(item.unit_price_at_sale),
          item_total: parseFloat(item.unit_price_at_sale) * item.quantity,
        })),
        item_count: items.length,
      };

      res.status(200).json({
        success: true,
        data: {
          order: orderWithItems,
        },
      });
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({
        success: false,
        message: "Server error while fetching order.",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
};

module.exports = orderHistoryController;
```

### `routes/orderRoutes.js`
**Description**: Routes for order operations. Includes checkout endpoint (Module 2.9.4) and order history endpoints (Module 2.9.5). Routes are protected with verifyToken middleware and role-based access control using allowRoles middleware. Route order is critical: GET / must come before GET /:orderId to ensure correct matching.

**Code**:
```javascript
const express = require("express");
const router = express.Router();

const checkoutController = require("../controllers/checkoutController");
const orderHistoryController = require("../controllers/orderHistoryController");
const verifyToken = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

// POST /api/orders/checkout - Checkout cart (Module 2.9.4)
router.post("/checkout", verifyToken, allowRoles("customer", "admin", "staff"), checkoutController.checkout);

// GET /api/orders - Get all orders (Admin/Staff only) (Module 2.9.5)
// IMPORTANT: Root route must come FIRST before any other GET routes to match correctly
router.get("/", verifyToken, allowRoles("admin", "staff"), orderHistoryController.getAllOrders);

// GET /api/orders/me - Get customer's own orders (Module 2.9.5)
// IMPORTANT: More specific routes must come before parameterized routes
router.get("/me", verifyToken, allowRoles("customer", "admin", "staff"), orderHistoryController.getMyOrders);

// GET /api/orders/:orderId - Get single order by ID
// IMPORTANT: Parameterized route must come LAST
router.get("/:orderId", verifyToken, allowRoles("customer", "admin", "staff"), orderHistoryController.getOrderById);

module.exports = router;
```

### `middleware/roleMiddleware.js`
**Description**: Middleware for role-based access control. Checks if the authenticated user's role is in the allowed roles list. Returns 403 Forbidden if the user's role is not in the allowed roles.

**Code**:
```javascript
const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized. No user data found." });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access forbidden. Insufficient privileges." });
    }

    return next();
  };
};

module.exports = allowRoles;
```
