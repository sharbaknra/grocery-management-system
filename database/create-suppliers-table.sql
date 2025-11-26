-- Module 2.8.4 - Supplier Directory & Purchasing Support
-- This migration introduces the dedicated suppliers table and
-- links the products table to suppliers via a foreign key.

USE grocery_db;

-- 1) Create suppliers table if it does not already exist
CREATE TABLE IF NOT EXISTS suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    address VARCHAR(500),
    lead_time_days INT NOT NULL DEFAULT 7,
    min_order_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_supplier_name (name),
    INDEX idx_supplier_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2) Add supplier_id column to products table if missing
ALTER TABLE products
ADD COLUMN IF NOT EXISTS supplier_id INT NULL,
ADD INDEX idx_supplier_id (supplier_id),
ADD CONSTRAINT fk_products_supplier
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
    ON DELETE SET NULL;

-- 3) Optional: populate suppliers table with placeholder data
INSERT INTO suppliers (name, contact_name, phone, email, address)
VALUES
('Placeholder Supplier', 'Purchasing Lead', '+92 300 0000000', 'orders@example.com', 'Update me!')
ON DUPLICATE KEY UPDATE name = name;

-- After running this script, update existing products to reference the correct supplier_id
-- and remove reliance on the deprecated products.supplier text column.

