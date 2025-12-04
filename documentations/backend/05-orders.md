# Orders Management

## Overview

The Orders module handles order creation, history tracking, and status management. Orders are created during checkout and include order items with historical pricing.

## Architecture

### Components
- **Controller**: `controllers/orderHistoryController.js`
- **Model**: `models/orderModel.js`, `models/orderItemModel.js`
- **Routes**: `routes/orderRoutes.js`

## API Endpoints

### GET `/api/orders`
Get all orders (Admin/Manager/Staff only).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "order_id": 1,
        "user_id": 1,
        "status": "Completed",
        "total_price": 100.00,
        "tax_applied": 10.00,
        "discount_applied": 0.00,
        "created_at": "2024-01-01T00:00:00.000Z",
        "user_name": "John Doe",
        "items": [ ... ],
        "item_count": 3
      }
    ],
    "total_orders": 1
  }
}
```

**Roles:** `admin`, `manager`, `staff`

### GET `/api/orders/me`
Get customer's own orders.

**Roles:** `customer`, `admin`, `manager`, `staff`

### GET `/api/orders/:orderId`
Get order by ID.

**Authorization:** Admin/Staff can view any order; Customers can only view their own.

### GET `/api/orders/:orderId/items`
Get order items for billing/invoices.

## Order Status

- **Pending**: Order created but not completed
- **Completed**: Order successfully processed
- **Cancelled**: Order cancelled

## Order Items

Each order item stores:
- `unit_price_at_sale`: Price at time of sale (critical for audit trails)
- `quantity`: Quantity purchased
- Product information (name, image, category)

## Related Documentation
- [Checkout](07-checkout.md)
- [Cart](06-cart.md)
- [Database Schema](../database/02-tables.md#orders-table)

