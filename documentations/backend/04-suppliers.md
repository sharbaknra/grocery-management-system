# Suppliers Management

## Overview

The Suppliers module manages supplier information and purchasing workflows. It provides supplier directory, reorder dashboards grouped by supplier, and supplier-specific reorder sheets for purchasing agents.

## Architecture

### Components
- **Controller**: `controllers/supplierController.js`
- **Model**: `models/supplierModel.js`
- **Routes**: `routes/supplierRoutes.js`

### Key Features
- Supplier directory with product counts and low stock alerts
- Reorder dashboard grouped by supplier
- Supplier-specific reorder sheets
- Product linking to suppliers

## API Endpoints

### GET `/api/suppliers`
Get all suppliers with statistics.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Fresh Produce Co",
      "contact_name": "John Doe",
      "phone": "+92 300 1234567",
      "email": "john@freshproduce.com",
      "address": "123 Main St",
      "lead_time_days": 5,
      "min_order_amount": 5000.00,
      "product_count": 10,
      "low_stock_items": 3
    }
  ]
}
```

**Roles:** `admin`, `manager`, `staff`, `purchasing`

### GET `/api/suppliers/:id`
Get supplier details with products and order history.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "supplier": { ... },
    "products": [ ... ],
    "order_history": [ ... ]
  }
}
```

### POST `/api/suppliers`
Create supplier (Admin/Manager only).

**Request Body:**
```json
{
  "name": "New Supplier",
  "contact_name": "Jane Smith",
  "phone": "+92 300 1234567",
  "email": "jane@supplier.com",
  "address": "456 Oak St",
  "lead_time_days": 7,
  "min_order_amount": 5000.00,
  "notes": "Preferred supplier"
}
```

**Roles:** `admin`, `manager`

### PUT `/api/suppliers/:id`
Update supplier (Admin/Manager only).

**Roles:** `admin`, `manager`

### DELETE `/api/suppliers/:id`
Delete supplier (Admin/Manager only).

**Note:** Products referencing this supplier retain history but `supplier_id` becomes NULL.

**Roles:** `admin`, `manager`

### GET `/api/suppliers/reorder`
Get reorder dashboard grouped by supplier.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "supplier_id": 1,
      "supplier_name": "Fresh Produce Co",
      "contact_name": "John Doe",
      "phone": "+92 300 1234567",
      "email": "john@freshproduce.com",
      "lead_time_days": 5,
      "min_order_amount": 5000.00,
      "items": [
        {
          "product_id": 1,
          "product_name": "Apple",
          "category": "Fruit",
          "quantity": 5,
          "min_stock_level": 10,
          "shortage": 5,
          "suggested_order_quantity": 15
        }
      ],
      "total_shortage": 20,
      "total_suggested_quantity": 30
    }
  ],
  "total_suppliers": 1
}
```

**Roles:** `admin`, `manager`, `staff`, `purchasing`

### GET `/api/suppliers/:id/reorder`
Get supplier-specific reorder sheet.

**Roles:** `admin`, `manager`, `staff`, `purchasing`

## Model Methods

### `Supplier.create(data)`
Creates a new supplier.

### `Supplier.getAllWithStats()`
Gets all suppliers with product counts and low stock item counts.

**SQL:** Joins suppliers, products, and stock tables with GROUP BY

### `Supplier.getReorderList(supplierId)`
Gets reorder list, optionally filtered by supplier.

**Logic:** Returns products where `quantity <= min_stock_level` with suggested order quantities.

## Related Documentation
- [Products](02-products.md)
- [Stock Management](03-stock-management.md)
- [Database Schema](../database/02-tables.md#suppliers-table)
