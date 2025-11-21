-- Module 2.8.7: Create stock_movements table for inventory audit trail
-- This table logs all inventory changes (Restock, Reduce, Sale) for auditing and compliance

USE grocery_db;

-- Create stock_movements table
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

-- Verify table creation
SHOW CREATE TABLE stock_movements;

-- Verify indexes
SHOW INDEX FROM stock_movements;

