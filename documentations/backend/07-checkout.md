# Checkout Process

## Overview

The Checkout module handles the complete checkout process including stock deduction, order creation, and cart clearing. Uses database transactions to ensure ACID compliance.

## Architecture

### Components
- **Controller**: `controllers/checkoutController.js`
- **Routes**: `routes/orderRoutes.js` (POST `/api/orders/checkout`)

## API Endpoints

### POST `/api/orders/checkout`
Process checkout from cart.

**Process:**
1. Validates cart is not empty
2. Begins database transaction
3. Validates stock availability with row-level locking
4. Atomically deducts stock for all items
5. Creates order record (status: "Completed")
6. Creates order items with `unit_price_at_sale`
7. Logs stock movements
8. Clears cart
9. Commits transaction

**Response (201):**
```json
{
  "success": true,
  "message": "Checkout completed successfully.",
  "data": {
    "order_id": 1,
    "order": { ... },
    "items": [ ... ],
    "total_price": 100.00,
    "tax_applied": 10.00,
    "discount_applied": 0.00,
    "cart_cleared": true
  }
}
```

**Error Handling:**
- Rolls back transaction on any error
- Returns `400` if cart is empty or insufficient stock
- Returns `500` on server errors

**Roles:** `customer`, `admin`, `manager`, `staff`

## Transaction Flow

1. **Begin Transaction**
2. **Stock Validation** (SELECT FOR UPDATE)
3. **Stock Deduction** (Atomic UPDATE)
4. **Order Creation**
5. **Order Items Creation**
6. **Stock Movement Logging**
7. **Cart Clearing**
8. **Commit Transaction**

## Stock Deduction

Uses atomic UPDATE to prevent negative stock:
```sql
UPDATE stock SET quantity = quantity - ? 
WHERE product_id = ? AND quantity >= ?
```

## Related Documentation
- [Cart](06-cart.md)
- [Orders](05-orders.md)
- [Stock Management](03-stock-management.md)
- [Database Transactions](../database/05-data-flow.md)

