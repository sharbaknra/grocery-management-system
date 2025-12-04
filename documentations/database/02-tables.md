# Database Tables

## users

**Purpose**: User accounts and authentication

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | User ID |
| name | VARCHAR(255) | NOT NULL | User's full name |
| email | VARCHAR(255) | NOT NULL, UNIQUE | Email address (unique) |
| password | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| role | ENUM | NOT NULL, DEFAULT 'customer' | User role: admin, manager, staff, purchasing, customer |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Account creation timestamp |

**Indexes**: `idx_email`, `idx_role`

## suppliers

**Purpose**: Supplier directory for purchasing

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Supplier ID |
| name | VARCHAR(255) | NOT NULL, UNIQUE | Supplier name |
| contact_name | VARCHAR(255) | NULL | Contact person name |
| phone | VARCHAR(50) | NULL | Phone number |
| email | VARCHAR(255) | NULL | Email address |
| address | VARCHAR(500) | NULL | Physical address |
| lead_time_days | INT | NOT NULL, DEFAULT 7 | Average fulfillment days |
| min_order_amount | DECIMAL(10,2) | NOT NULL, DEFAULT 0.00 | Minimum order value |
| notes | TEXT | NULL | Additional notes |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Update timestamp |

**Indexes**: `unique_supplier_name`, `idx_supplier_email`

## products

**Purpose**: Product catalog

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Product ID |
| name | VARCHAR(255) | NOT NULL | Product name |
| category | VARCHAR(100) | NOT NULL | Product category |
| price | DECIMAL(10,2) | NOT NULL | Current price |
| barcode | VARCHAR(100) | UNIQUE | Barcode (optional, unique) |
| description | TEXT | NULL | Product description |
| expiry_date | DATE | NULL | Expiry date |
| supplier_id | INT | NULL, FK → suppliers.id | Linked supplier |
| image_url | VARCHAR(500) | NULL | Image filename |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Update timestamp |

**Indexes**: `idx_category`, `idx_barcode`, `idx_name`, `idx_supplier_id`

## stock

**Purpose**: Inventory tracking

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| product_id | INT | PRIMARY KEY, FK → products.id | Product ID (1:1) |
| quantity | INT | NOT NULL, DEFAULT 0 | Current stock quantity |
| min_stock_level | INT | NOT NULL, DEFAULT 10 | Minimum stock threshold |
| last_restock_date | TIMESTAMP | NULL | Last restock timestamp |

**Indexes**: `idx_quantity`, `idx_min_stock_level`

## orders

**Purpose**: Order records

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| order_id | INT | PRIMARY KEY, AUTO_INCREMENT | Order ID |
| user_id | INT | NOT NULL, FK → users.id | User who placed the order (staff/manager/customer) |
| status | ENUM | NOT NULL, DEFAULT 'Pending' | Order status: Pending, Completed, Cancelled |
| total_price | DECIMAL(10,2) | NOT NULL, DEFAULT 0.00 | Order total |
| tax_applied | DECIMAL(10,2) | NOT NULL, DEFAULT 0.00 | Tax amount |
| discount_applied | DECIMAL(10,2) | NOT NULL, DEFAULT 0.00 | Discount amount |
| customer_name | VARCHAR(255) | NULL | End-customer name for POS sales (optional) |
| customer_phone | VARCHAR(50) | NULL | End-customer phone for POS sales (optional) |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Order timestamp |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Update timestamp |

**Indexes**: `idx_user_id`, `idx_status`, `idx_created_at`, `idx_status_created_at`

## order_items

**Purpose**: Order line items with historical pricing

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| order_item_id | INT | PRIMARY KEY, AUTO_INCREMENT | Item ID |
| order_id | INT | NOT NULL, FK → orders.order_id | Order ID |
| product_id | INT | NOT NULL, FK → products.id | Product ID |
| quantity | INT | NOT NULL | Quantity purchased |
| unit_price_at_sale | DECIMAL(10,2) | NOT NULL | Price at time of sale (critical for audit) |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Item timestamp |

**Indexes**: `idx_order_id`, `idx_product_id`

## cart

**Purpose**: Shopping cart items

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| cart_id | INT | PRIMARY KEY, AUTO_INCREMENT | Cart item ID |
| user_id | INT | NOT NULL, FK → users.id | User ID |
| product_id | INT | NOT NULL, FK → products.id | Product ID |
| quantity | INT | NOT NULL, DEFAULT 1 | Quantity in cart |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Added timestamp |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Updated timestamp |

**Indexes**: `idx_user_id`, `idx_product_id`, `idx_user_product`, `unique_user_product`

## stock_movements

**Purpose**: Audit trail for inventory changes

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| movement_id | INT | PRIMARY KEY, AUTO_INCREMENT | Movement ID |
| product_id | INT | NOT NULL, FK → products.id | Product ID |
| user_id | INT | NOT NULL, FK → users.id | User who made change |
| change_amount | INT | NOT NULL | Positive for restock, negative for reduce/sale |
| reason | ENUM | NOT NULL | Reason: Restock, Reduce, Sale |
| timestamp | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Movement timestamp |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

**Indexes**: `idx_product_id`, `idx_user_id`, `idx_timestamp`, `idx_reason`

## Related Documentation
- [Schema Overview](01-schema-overview.md)
- [Indexes](03-indexes.md)

