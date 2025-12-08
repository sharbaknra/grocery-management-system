# Database Indexes

## Purpose

Indexes improve query performance for frequently accessed columns and foreign keys.

## Index List

### users
- `idx_email` - Email lookups (login)
- `idx_role` - Role-based queries

### suppliers
- `unique_supplier_name` - Unique constraint on name
- `idx_supplier_email` - Email searches

### products
- `idx_category` - Category filtering
- `idx_barcode` - Barcode lookups (unique)
- `idx_name` - Product name searches
- `idx_supplier_id` - Supplier joins

### stock
- `idx_quantity` - Quantity filtering
- `idx_min_stock_level` - Low stock queries
- `idx_stock_quantity_min_level` - Composite index for low stock detection

### orders
- `idx_user_id` - User order history
- `idx_status` - Status filtering
- `idx_created_at` - Date-based queries
- `idx_status_created_at` - Composite for status + date queries

### order_items
- `idx_order_id` - Order item retrieval
- `idx_product_id` - Product sales history

### cart
- `idx_user_id` - User cart retrieval
- `idx_product_id` - Product cart lookups
- `idx_user_product` - Composite for cart item lookups
- `unique_user_product` - Prevents duplicate cart entries

### stock_movements
- `idx_product_id` - Product movement history
- `idx_user_id` - User activity tracking
- `idx_timestamp` - Time-based queries
- `idx_reason` - Reason filtering

## Performance Considerations

1. **Composite Indexes**: Used for multi-column queries (e.g., `idx_status_created_at`)
2. **Foreign Keys**: Automatically indexed for join performance
3. **Unique Constraints**: Create indexes automatically
4. **Low Stock Queries**: Composite index on `(quantity, min_stock_level)` optimizes low stock detection

## Related Documentation
- [Tables](02-tables.md)
- [Schema Overview](01-schema-overview.md)

