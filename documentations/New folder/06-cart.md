# Shopping Cart

## Overview

The Cart module manages user shopping carts. Cart items are stored per user and validated against available stock.

## Architecture

### Components
- **Controller**: `controllers/cartController.js`
- **Model**: `models/cartModel.js`
- **Routes**: `routes/cartRoutes.js`

## API Endpoints

### POST `/api/orders/cart/add`
Add item to cart.

**Request Body:**
```json
{
  "productId": 1,
  "quantity": 2
}
```

**Validation:** Checks stock availability before adding.

**Roles:** `customer`, `admin`, `manager`, `staff`

### GET `/api/orders/cart`
Get user's cart.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "cart_id": 1,
        "product_id": 1,
        "product_name": "Apple",
        "quantity": 2,
        "current_price": 50.00,
        "available_stock": 100
      }
    ],
    "total_items": 2,
    "item_count": 1
  }
}
```

### PUT `/api/orders/cart/update`
Update cart item quantity.

**Request Body:**
```json
{
  "productId": 1,
  "quantity": 3
}
```

### DELETE `/api/orders/cart/remove/:productId`
Remove item from cart.

### DELETE `/api/orders/cart/clear`
Clear entire cart.

## Stock Validation

- Cart operations validate stock availability
- Prevents adding more than available stock
- Checks existing cart quantity + new quantity <= available stock

## Related Documentation
- [Checkout](07-checkout.md)
- [Products](02-products.md)
- [Database Schema](../database/02-tables.md#cart-table)

