-- Module 2.10.1: Performance indexes for Sales Reports
-- These indexes optimize queries that filter by status='Completed' and date ranges

USE grocery_db;

-- Composite index on (status, created_at) for efficient filtering of completed orders by date
-- This is critical for sales reports which always filter by status='Completed'
CREATE INDEX IF NOT EXISTS idx_status_created_at ON orders(status, created_at);

-- Verify index creation
SHOW INDEX FROM orders WHERE Key_name = 'idx_status_created_at';

-- Note: The following indexes should already exist from previous modules:
-- - idx_created_at on orders.created_at (from Module 2.9.1-2.9.2)
-- - idx_status on orders.status (from Module 2.9.1-2.9.2)
-- - idx_order_id on order_items.order_id (from Module 2.9.1-2.9.2)
-- - idx_product_id on order_items.product_id (from Module 2.9.1-2.9.2)

-- If the composite index doesn't provide sufficient performance improvement,
-- consider creating a covering index that includes frequently selected columns:
-- CREATE INDEX idx_orders_covering ON orders(status, created_at, order_id, total_price);

