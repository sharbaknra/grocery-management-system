# Stock Management

## Overview

The Stock Management module handles inventory operations including restocking, reducing stock, low stock alerts, and stock movement tracking. All stock operations use atomic SQL updates to prevent race conditions and ensure data integrity.

## Architecture

### Components
- **Controller**: `controllers/stockController.js` - Handles stock operations
- **Model**: `models/stockModel.js` - Database operations for stock
- **Routes**: `routes/stockRoutes.js` - API endpoint definitions

### Design Patterns
- **Atomic Updates**: Uses SQL `UPDATE` with conditional checks to prevent negative stock
- **Stock Movement Logging**: All changes are logged to `stock_movements` table for audit trail
- **Low Stock Detection**: Differentiates between "Low Stock" (quantity > 0 AND < min) and "Out of Stock" (quantity = 0)

## API Endpoints

### POST `/api/stock/restock`
Restock a product (Admin/Manager only).

**Request Body:**
```json
{
  "productId": 1,
  "quantity": 50,
  "reason": "Restock from supplier"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Stock restocked successfully.",
  "data": {
    "productId": 1,
    "previousQuantity": 10,
    "newQuantity": 60,
    "added": 50
  }
}
```

**Error Responses:**
- `400` - Invalid productId or quantity (must be positive integers)
- `404` - Product or stock entry not found
- `500` - Server error

**Roles:** `admin`, `manager`

### POST `/api/stock/reduce`
Reduce stock quantity (Admin/Manager/Staff).

**Request Body:**
```json
{
  "productId": 1,
  "quantity": 5,
  "reason": "Damaged items"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Stock reduced successfully.",
  "data": {
    "productId": 1,
    "previousQuantity": 60,
    "newQuantity": 55,
    "deducted": 5
  }
}
```

**Error Responses:**
- `400` - Invalid input or insufficient stock
- `404` - Product or stock entry not found
- `500` - Server error

**Roles:** `admin`, `manager`, `staff`

### GET `/api/stock/low-stock`
Get low stock items (quantity > 0 AND < min_stock_level).

**Response (200):**
```json
{
  "success": true,
  "message": "Low stock items retrieved successfully.",
  "data": {
    "items": [
      {
        "id": 1,
        "name": "Apple",
        "quantity": 5,
        "min_stock_level": 10
      }
    ],
    "count": 1
  }
}
```

**Roles:** `admin`, `manager`, `staff`, `purchasing`

### GET `/api/stock/movements`
Get stock movement history.

**Query Parameters:**
- `productId` (number, optional) - Filter by product ID
- `limit` (number, optional) - Limit results (default: 100)

**Response (200):**
```json
{
  "success": true,
  "message": "Stock movement history retrieved successfully.",
  "data": {
    "movements": [
      {
        "movement_id": 1,
        "product_id": 1,
        "product_name": "Apple",
        "user_id": 1,
        "user_name": "Admin",
        "change_amount": 50,
        "reason": "Restock",
        "timestamp": "2024-01-01T00:00:00.000Z"
      }
    ],
    "count": 1
  }
}
```

**Roles:** `admin`, `manager`, `staff`, `purchasing`

## Controller Functions

### `stockController.restock(req, res)`
Increases stock quantity.

**Process:**
1. Validates productId and quantity (positive integers)
2. Verifies product exists
3. Verifies stock entry exists
4. Atomically increments stock quantity
5. Logs stock movement (non-blocking)
6. Returns updated stock information

### `stockController.reduce(req, res)`
Decreases stock quantity.

**Process:**
1. Validates productId and quantity (positive integers)
2. Verifies product exists
3. Verifies stock entry exists
4. Atomically decrements stock (prevents negative stock)
5. Logs stock movement with negative change_amount
6. Returns updated stock information

**Note:** Uses conditional UPDATE to prevent negative stock:
```sql
UPDATE stock SET quantity = quantity - ? 
WHERE product_id = ? AND quantity >= ?
```

### `stockController.getLowStock(req, res)`
Retrieves low stock items.

**Definition:** Items where `quantity > 0 AND quantity < min_stock_level AND min_stock_level > 0`

**Note:** Items with `quantity = 0` are "Out of Stock", not "Low Stock"

### `stockController.getMovementHistory(req, res)`
Retrieves stock movement audit log.

**Process:**
1. Optionally filters by productId
2. Joins with products and users tables
3. Orders by timestamp DESC
4. Limits results

## Model Methods

### `Stock.create(productId, quantity)`
Initializes stock for a new product.

**SQL:**
```sql
INSERT INTO stock (product_id, quantity) VALUES (?, ?)
```

### `Stock.getByProductId(productId)`
Retrieves stock record for a product.

**SQL:**
```sql
SELECT * FROM stock WHERE product_id = ?
```

### `Stock.restock(productId, quantity)`
Atomically increments stock.

**SQL:**
```sql
UPDATE stock
SET quantity = quantity + ?, last_restock_date = NOW()
WHERE product_id = ?
```

### `Stock.reduce(productId, quantity)`
Atomically decrements stock (prevents negative).

**SQL:**
```sql
UPDATE stock
SET quantity = quantity - ?
WHERE product_id = ? AND quantity >= ?
```

**Returns:** `affectedRows` - 0 if insufficient stock

### `Stock.getLowStock()`
Retrieves low stock items.

**SQL:**
```sql
SELECT p.id, p.name, s.quantity, s.min_stock_level 
FROM products p
JOIN stock s ON p.id = s.product_id
WHERE s.quantity > 0
  AND s.quantity < s.min_stock_level
  AND s.min_stock_level > 0
ORDER BY s.quantity ASC
```

### `Stock.deleteByProductId(productId)`
Deletes stock record (used when product is deleted).

**SQL:**
```sql
DELETE FROM stock WHERE product_id = ?
```

### `Stock.logMovement(productId, userId, changeAmount, reason)`
Logs stock movement for audit trail.

**SQL:**
```sql
INSERT INTO stock_movements (product_id, user_id, change_amount, reason)
VALUES (?, ?, ?, ?)
```

**Parameters:**
- `changeAmount` - Positive for restock, negative for reduce/sale
- `reason` - "Restock", "Reduce", "Sale", etc.

### `Stock.getMovementHistory(productId, limit)`
Retrieves movement history.

**SQL:** Joins `stock_movements`, `products`, and `users` tables

## Stock Status Definitions

### Low Stock
- **Condition**: `quantity > 0 AND quantity < min_stock_level AND min_stock_level > 0`
- **Purpose**: Alert for items that need reordering soon
- **Example**: Quantity = 5, Min Level = 10 → Low Stock

### Out of Stock
- **Condition**: `quantity = 0`
- **Purpose**: Alert for items completely unavailable
- **Example**: Quantity = 0 → Out of Stock

### OK Stock
- **Condition**: `quantity >= min_stock_level`
- **Purpose**: Items with sufficient inventory
- **Example**: Quantity = 50, Min Level = 10 → OK

## Atomic Operations

### Why Atomic Updates?
- Prevents race conditions in concurrent environments
- Ensures data integrity
- Prevents negative stock

### Implementation
```sql
-- Restock: Always succeeds if product exists
UPDATE stock SET quantity = quantity + ? WHERE product_id = ?

-- Reduce: Only succeeds if sufficient stock
UPDATE stock SET quantity = quantity - ? 
WHERE product_id = ? AND quantity >= ?
```

## Stock Movement Logging

### Purpose
- Audit trail for all inventory changes
- Compliance and accountability
- Historical analysis

### Logged Information
- Product ID
- User ID (who made the change)
- Change amount (positive/negative)
- Reason (Restock, Reduce, Sale, etc.)
- Timestamp

### Non-Blocking
- Logging errors don't fail the main operation
- Errors are logged but transaction continues

## Error Handling

### Common Errors

**400 Bad Request:**
- Invalid productId or quantity (not positive integers)
- Insufficient stock (for reduce operations)

**404 Not Found:**
- Product not found
- Stock entry not initialized

**500 Internal Server Error:**
- Database errors
- Transaction failures

## Usage Examples

### Restock Product
```javascript
const response = await fetch('http://localhost:3000/api/stock/restock', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    productId: 1,
    quantity: 50,
    reason: 'Restock from supplier'
  })
});
```

### Reduce Stock
```javascript
const response = await fetch('http://localhost:3000/api/stock/reduce', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    productId: 1,
    quantity: 5,
    reason: 'Damaged items'
  })
});
```

### Get Low Stock Items
```javascript
const response = await fetch('http://localhost:3000/api/stock/low-stock', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

## Related Documentation
- [Products](02-products.md)
- [Reports](08-reports.md)
- [Database Schema](../database/02-tables.md#stock-table)
