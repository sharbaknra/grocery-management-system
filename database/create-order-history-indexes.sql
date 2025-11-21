-- Module 2.9.5: Create indexes for order history queries
-- These indexes optimize queries for order history retrieval

USE grocery_db;

-- Index on orders.user_id (for filtering orders by user)
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

-- Index on orders.created_at (for sorting orders by date)
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- Index on order_items.order_id (for joining order items with orders)
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Verify indexes
SHOW INDEX FROM orders WHERE Key_name LIKE 'idx_orders%';
SHOW INDEX FROM order_items WHERE Key_name LIKE 'idx_order_items%';

