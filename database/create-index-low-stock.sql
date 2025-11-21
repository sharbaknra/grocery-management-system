-- Module 2.8.3: Create composite index for low stock alerts optimization
-- This index optimizes queries that filter by quantity and min_stock_level
-- Execute this script in your MySQL database

USE grocery_db;

-- Create composite index on (quantity, min_stock_level) for efficient low stock queries
CREATE INDEX idx_stock_quantity_min_level ON stock(quantity, min_stock_level);

-- Verify index creation
SHOW INDEX FROM stock WHERE Key_name = 'idx_stock_quantity_min_level';

