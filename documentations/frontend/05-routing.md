# Frontend Routing

## Overview

Hash-based routing system with role-based access control.

## Route Format

```
#route-name?param=value
```

## Role-Based Routes

### Admin/Manager Routes
- `manager-dashboard`
- `products`, `product-detail`, `product-form`
- `stock`
- `suppliers`, `supplier-detail`, `supplier-form`
- `reorder-dashboard`
- `orders`, `order-detail`
- `reports`
- `billing`, `invoice-detail`
- `settings`
- `staff-list`, `staff-form`, `staff-detail`

### Staff Routes
- `pos`
- `orders`, `order-detail`
- `billing`, `invoice-detail`

### Purchasing Routes
- `purchasing-dashboard`
- `suppliers`, `supplier-detail`
- `reorder-dashboard`
- `stock`

### Public Routes
- `home`
- `login`
- `register`

## Default Dashboards

- Admin/Manager: `manager-dashboard`
- Staff: `pos`
- Purchasing: `purchasing-dashboard`

## Navigation

### Programmatic Navigation
```javascript
navigate("products", { id: 1 });
```

### Link Navigation
```html
<button data-route="products">Products</button>
```

## Access Control

- Unauthenticated users redirected to login
- Authenticated users redirected to role dashboard if accessing login/home
- Role-based route access enforced
- Unauthorized access redirects to default dashboard

## Related Documentation
- [Architecture](01-architecture.md)
- [State Management](04-state-management.md)

