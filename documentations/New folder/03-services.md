# Frontend Services

## Overview

The service layer abstracts API calls and provides a consistent interface for frontend pages.

## API Client

### `apiClient.js`
**Base URL**: `http://localhost:5000/api` (configurable)

**Methods**:
- `get(path, options)` - GET request
- `post(path, data, options)` - POST request
- `put(path, data, options)` - PUT request
- `delete(path, options)` - DELETE request

**Features**:
- Automatic token injection from `appState`
- Query string building
- Error normalization
- FormData support for file uploads

### Image URL Helper
```javascript
getImageUrl(filename) // Returns full URL to uploaded image
```

## Service Modules

### `authService.js`
- `login(email, password)` - User login
- `register(userData)` - User registration
- `logout()` - User logout

### `productsService.js`
- `getAll()` - List products
- `getById(id)` - Get product
- `create(data)` - Create product (FormData)
- `update(id, data)` - Update product (FormData)
- `delete(id)` - Delete product
- `search(name)` - Search products

### `stockService.js`
- `restock(payload)` - Restock product
- `reduce(payload)` - Reduce stock
- `getLowStock()` - Get low stock items
- `getMovements(productId)` - Get movement history

### `suppliersService.js`
- `getAll()` - List suppliers
- `getById(id)` - Get supplier
- `create(data)` - Create supplier
- `update(id, data)` - Update supplier
- `delete(id)` - Delete supplier
- `getReorderDashboard()` - Get reorder dashboard
- `getSupplierReorderSheet(id)` - Get supplier reorder sheet

### `ordersService.js`
- `getAll()` - List all orders
- `getMyOrders()` - Get user's orders
- `getById(id)` - Get order
- `getItems(orderId)` - Get order items

### `cartService.js`
- `addItem(productId, quantity)` - Add to cart
- `getCart()` - Get cart
- `updateItem(productId, quantity)` - Update cart item
- `removeItem(productId)` - Remove item
- `clearCart()` - Clear cart

### `billingService.js`
- `getInvoices()` - List invoices
- `getInvoiceById(id)` - Get invoice
- `getInvoiceItems(orderId)` - Get invoice items

### `reportsService.js`
- `getSalesSummary()` - Sales summary
- `getDailySalesTrends(days)` - Daily trends
- `getWeeklySalesTrends()` - Weekly trends
- `getMonthlySalesTrends(months)` - Monthly trends
- `getLowStock()` - Low stock report
- `getOutOfStock()` - Out of stock report
- `getExpiringProducts(days)` - Expiring products
- `getInventoryValuation()` - Inventory valuation
- `getTopSelling(limit)` - Top selling products
- `getDeadStock()` - Dead stock
- `getCategorySales()` - Category sales
- `exportCSV(type, params)` - Export CSV
- `exportPDF(type, params)` - Export PDF

### `usersService.js`
- `listUsers()` - List users
- `getUserById(id)` - Get user
- `createUser(payload)` - Create staff user
- `updateUser(id, payload)` - Update user
- `deleteUser(id)` - Delete user

## Error Handling

All services use `apiClient` which normalizes errors:
```javascript
{
  status: 400,
  message: "Error message",
  details: { ... }
}
```

## Related Documentation
- [API Client](../backend/09-api-reference.md)
- [State Management](04-state-management.md)

