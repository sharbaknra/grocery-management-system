# Database Schema Overview

## Database Name
`grocery_db`

## Engine
InnoDB with UTF8MB4 charset

## Entity Relationship Diagram

```
users
  ├── orders (user_id) [1:N]
  ├── cart (user_id) [1:N]
  └── stock_movements (user_id) [1:N]

suppliers
  └── products (supplier_id) [1:N, SET NULL on delete]

products
  ├── stock (product_id) [1:1, CASCADE on delete]
  ├── order_items (product_id) [1:N, RESTRICT on delete]
  ├── cart (product_id) [1:N, CASCADE on delete]
  └── stock_movements (product_id) [1:N, CASCADE on delete]

orders
  └── order_items (order_id) [1:N, CASCADE on delete]
```

## Table Relationships

### Users → Orders
- **Type**: One-to-Many
- **Foreign Key**: `orders.user_id` → `users.id`
- **On Delete**: RESTRICT (prevents deleting users with orders)

### Users → Cart
- **Type**: One-to-Many
- **Foreign Key**: `cart.user_id` → `users.id`
- **On Delete**: CASCADE (cart cleared when user deleted)

### Users → Stock Movements
- **Type**: One-to-Many
- **Foreign Key**: `stock_movements.user_id` → `users.id`
- **On Delete**: RESTRICT

### Suppliers → Products
- **Type**: One-to-Many
- **Foreign Key**: `products.supplier_id` → `suppliers.id`
- **On Delete**: SET NULL (products retain history)

### Products → Stock
- **Type**: One-to-One
- **Foreign Key**: `stock.product_id` → `products.id`
- **On Delete**: CASCADE (stock deleted with product)

### Products → Order Items
- **Type**: One-to-Many
- **Foreign Key**: `order_items.product_id` → `products.id`
- **On Delete**: RESTRICT (prevents deleting products with order history)

### Products → Cart
- **Type**: One-to-Many
- **Foreign Key**: `cart.product_id` → `products.id`
- **On Delete**: CASCADE

### Products → Stock Movements
- **Type**: One-to-Many
- **Foreign Key**: `stock_movements.product_id` → `products.id`
- **On Delete**: CASCADE

### Orders → Order Items
- **Type**: One-to-Many
- **Foreign Key**: `order_items.order_id` → `orders.order_id`
- **On Delete**: CASCADE (items deleted with order)

## Key Design Decisions

1. **Historical Pricing**: `order_items.unit_price_at_sale` stores price at time of sale
2. **Cascade Rules**: Stock and cart cascade with products; order items cascade with orders
3. **Restrict Rules**: Prevent deletion of users/products with order history
4. **SET NULL**: Products retain supplier history when supplier deleted

## Related Documentation
- [Tables](02-tables.md)
- [Indexes](03-indexes.md)
- [Data Flow](05-data-flow.md)

