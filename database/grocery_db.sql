-- ============================================================================
-- Grocery Management System - Complete Database Dump
-- Module 2.11.1: Local Environment Setup
-- This file contains the complete database schema and seed data
-- It is self-contained and can be imported with a single command
-- ============================================================================

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS grocery_db;
USE grocery_db;

-- ============================================================================
-- TABLE CREATION
-- ============================================================================

-- Users table (Module 2.6)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'staff', 'customer') NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Suppliers table (Module 2.8.4)
CREATE TABLE IF NOT EXISTS suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    address VARCHAR(500),
    lead_time_days INT NOT NULL DEFAULT 7 COMMENT 'Average days needed to fulfill a purchase order',
    min_order_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_supplier_name (name),
    INDEX idx_supplier_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Products table (Module 2.7)
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    barcode VARCHAR(100) UNIQUE,
    description TEXT,
    expiry_date DATE,
    supplier_id INT NULL,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL,
    INDEX idx_category (category),
    INDEX idx_barcode (barcode),
    INDEX idx_name (name),
    INDEX idx_supplier_id (supplier_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Stock table (Module 2.8)
CREATE TABLE IF NOT EXISTS stock (
    product_id INT NOT NULL PRIMARY KEY,
    quantity INT NOT NULL DEFAULT 0,
    min_stock_level INT NOT NULL DEFAULT 10,
    last_restock_date TIMESTAMP NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_quantity (quantity),
    INDEX idx_min_stock_level (min_stock_level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Orders table (Module 2.9.1-2.9.2)
CREATE TABLE IF NOT EXISTS orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    status ENUM('Pending', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Pending',
    total_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    tax_applied DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    discount_applied DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_status_created_at (status, created_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Order items table (Module 2.9.1-2.9.2)
CREATE TABLE IF NOT EXISTS order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price_at_sale DECIMAL(10, 2) NOT NULL COMMENT 'Price at time of sale - critical for audit trails',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Cart table (Module 2.9.3)
CREATE TABLE IF NOT EXISTS cart (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_product_id (product_id),
    INDEX idx_user_product (user_id, product_id),
    UNIQUE KEY unique_user_product (user_id, product_id) COMMENT 'Prevent duplicate cart entries for same product',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Stock movements table (Module 2.8.7)
CREATE TABLE IF NOT EXISTS stock_movements (
    movement_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    change_amount INT NOT NULL COMMENT 'Positive for Restock, Negative for Reduce/Sale',
    reason ENUM('Restock', 'Reduce', 'Sale') NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_product_id (product_id),
    INDEX idx_user_id (user_id),
    INDEX idx_timestamp (timestamp),
    INDEX idx_reason (reason),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Additional indexes for optimization (Module 2.8.3, 2.9.5, 2.10.1)
CREATE INDEX IF NOT EXISTS idx_stock_quantity_min_level ON stock(quantity, min_stock_level);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Admin user (password: admin123)
INSERT INTO users (name, email, password, role) VALUES
('Admin', 'admin@grocery.com', '$2b$10$XzIVAuiL16Q1sO7KLvGS9ubHH7tV2PGI2G4bNRZOkwJ2X3EwMaHTC', 'admin')
ON DUPLICATE KEY UPDATE email=email;

-- Staff user (password: staff123)
INSERT INTO users (name, email, password, role) VALUES
('Staff Member', 'staff@grocery.com', '$2b$10$LZCZzicsx7dvKL9woTTfyO5U.RjCzWvdVBmvd3bNWDcWbhWfV5z4W', 'staff')
ON DUPLICATE KEY UPDATE email=email;

-- Sample suppliers
INSERT INTO suppliers (name, contact_name, phone, email, address, lead_time_days, min_order_amount, notes) VALUES
('Dairy Farm Co.', 'Sarah Khan', '+92 300 1234567', 'sarah@dairyfarm.example', '45 Milk Street, Lahore', 5, 5000.00, 'Delivers every Monday'),
('Bakery Fresh', 'Ali Raza', '+92 301 9876543', 'orders@bakeryfresh.example', '12 Bread Lane, Islamabad', 3, 2500.00, 'Prefers orders in multiples of 50 loaves'),
('Tropical Fruits Inc.', 'Maria Gomez', '+92 302 5551212', 'maria@tropicalfruits.example', '78 Orchard Road, Karachi', 4, 4000.00, 'Ships in insulated crates'),
('Garden Fresh', 'Ahmed Nawaz', '+92 321 3332221', 'sales@gardenfresh.example', '5 Green Block, Faisalabad', 2, 1500.00, 'Same-day dispatch if ordered before noon'),
('National Provisions', 'Bilal Aslam', '+92 333 1118899', 'bilal@nationalprov.example', '90 Supply Park, Multan', 7, 8000.00, 'Handles pantry staples and beverages')
ON DUPLICATE KEY UPDATE name = name;

-- Sample products with various categories
INSERT INTO products (name, category, price, barcode, description, expiry_date, supplier_id, image_url) VALUES
('Fresh Milk', 'Dairy', 3.99, '1234567890123', 'Fresh whole milk, 1 liter', DATE_ADD(CURDATE(), INTERVAL 7 DAY), 1, NULL),
('White Bread', 'Bakery', 2.49, '1234567890124', 'Fresh white bread loaf', DATE_ADD(CURDATE(), INTERVAL 3 DAY), 2, NULL),
('Organic Eggs', 'Dairy', 4.99, '1234567890125', 'Free-range organic eggs, 12 count', DATE_ADD(CURDATE(), INTERVAL 14 DAY), 1, NULL),
('Bananas', 'Fruits', 1.99, '1234567890126', 'Fresh yellow bananas, per pound', DATE_ADD(CURDATE(), INTERVAL 5 DAY), 3, NULL),
('Tomatoes', 'Vegetables', 2.99, '1234567890127', 'Fresh red tomatoes, per pound', DATE_ADD(CURDATE(), INTERVAL 7 DAY), 4, NULL),
('Chicken Breast', 'Meat', 8.99, '1234567890128', 'Fresh chicken breast, per pound', DATE_ADD(CURDATE(), INTERVAL 2 DAY), 5, NULL),
('Orange Juice', 'Beverages', 3.49, '1234567890129', '100% pure orange juice, 1 liter', DATE_ADD(CURDATE(), INTERVAL 30 DAY), 5, NULL),
('Rice', 'Grains', 5.99, '1234567890130', 'Long grain white rice, 2kg bag', NULL, 5, NULL),
('Pasta', 'Grains', 2.99, '1234567890131', 'Spaghetti pasta, 500g', NULL, 5, NULL),
('Cooking Oil', 'Condiments', 4.49, '1234567890132', 'Vegetable cooking oil, 1 liter', DATE_ADD(CURDATE(), INTERVAL 365 DAY), 5, NULL)
ON DUPLICATE KEY UPDATE name=name;

-- Stock entries for products
INSERT INTO stock (product_id, quantity, min_stock_level, last_restock_date) VALUES
(1, 50, 20, NOW()),
(2, 30, 15, NOW()),
(3, 40, 20, NOW()),
(4, 25, 10, NOW()),
(5, 35, 15, NOW()),
(6, 20, 10, NOW()),
(7, 45, 20, NOW()),
(8, 60, 30, NOW()),
(9, 50, 25, NOW()),
(10, 40, 20, NOW())
ON DUPLICATE KEY UPDATE quantity=quantity;

-- ============================================================================
-- VERIFICATION QUERIES (Optional - can be commented out)
-- ============================================================================

-- Verify tables created
-- SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = 'grocery_db';

-- Verify users
-- SELECT id, name, email, role FROM users;

-- Verify products with stock
-- SELECT p.id, p.name, p.category, p.price, s.quantity, s.min_stock_level 
-- FROM products p 
-- LEFT JOIN stock s ON p.id = s.product_id 
-- ORDER BY p.id;

-- ============================================================================
-- END OF DUMP
-- ============================================================================

