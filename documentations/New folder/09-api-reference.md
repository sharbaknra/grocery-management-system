# Complete API Reference

## Base URL
```
http://localhost:3000/api
```

## Authentication

All protected endpoints require:
```
Authorization: Bearer <token>
```

## Endpoints Summary

### Authentication (`/api/users`)
- `POST /register` - Register user (public)
- `POST /login` - Login (public)
- `GET /` - List users (admin/manager)
- `POST /staff` - Create staff (admin/manager)
- `GET /:id` - Get user (admin/manager)
- `PUT /:id` - Update user (admin/manager)
- `DELETE /:id` - Delete user (admin/manager)

### Products (`/api/products`)
- `GET /` - List products (auth)
- `GET /search` - Search products (auth)
- `GET /:id` - Get product (auth)
- `POST /add` - Create product (admin, multipart)
- `PUT /update/:id` - Update product (admin, multipart)
- `DELETE /delete/:id` - Delete product (admin)

### Stock (`/api/stock`)
- `POST /restock` - Restock product (admin/manager)
- `POST /reduce` - Reduce stock (admin/manager/staff)
- `GET /low-stock` - Get low stock items (auth)
- `GET /movements` - Get movement history (auth)

### Suppliers (`/api/suppliers`)
- `GET /` - List suppliers (auth)
- `GET /:id` - Get supplier (auth)
- `POST /` - Create supplier (admin/manager)
- `PUT /:id` - Update supplier (admin/manager)
- `DELETE /:id` - Delete supplier (admin/manager)
- `GET /reorder` - Reorder dashboard (auth)
- `GET /:id/reorder` - Supplier reorder sheet (auth)

### Cart (`/api/orders/cart`)
- `POST /add` - Add to cart (auth)
- `GET /` - Get cart (auth)
- `PUT /update` - Update cart item (auth)
- `DELETE /remove/:productId` - Remove item (auth)
- `DELETE /clear` - Clear cart (auth)

### Orders (`/api/orders`)
- `POST /checkout` - Checkout cart (auth)
- `GET /` - List all orders (admin/manager/staff)
- `GET /me` - Get my orders (auth)
- `GET /:orderId` - Get order (auth)
- `GET /:orderId/items` - Get order items (auth)

### Reports (`/api/reports`)
- `GET /sales/summary` - Sales summary (admin/staff)
- `GET /sales/daily` - Daily trends (admin/staff)
- `GET /sales/weekly` - Weekly trends (admin/staff)
- `GET /sales/monthly` - Monthly trends (admin/staff)
- `GET /inventory/low-stock` - Low stock (admin/staff)
- `GET /inventory/out-of-stock` - Out of stock (admin/staff)
- `GET /inventory/expiring` - Expiring products (admin/staff)
- `GET /inventory/valuation` - Inventory valuation (admin/staff)
- `GET /products/top-selling` - Top selling (admin/staff)
- `GET /products/dead` - Dead stock (admin/staff)
- `GET /products/category-sales` - Category sales (admin/staff)
- `GET /export/csv` - Export CSV (admin/staff)
- `GET /export/pdf` - Export PDF (admin/staff)

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error (development only)"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Related Documentation
- [Authentication](01-authentication.md)
- [Products](02-products.md)
- [Stock Management](03-stock-management.md)
- [Suppliers](04-suppliers.md)
- [Orders](05-orders.md)
- [Cart](06-cart.md)
- [Checkout](07-checkout.md)
- [Reports](08-reports.md)

