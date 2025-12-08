# Reports and Analytics

## Overview

The Reports module provides comprehensive sales, inventory, and product performance reports with CSV/PDF export capabilities.

## Architecture

### Components
- **Controller**: `controllers/reportsController.js`
- **Model**: `models/reportsModel.js`
- **Routes**: `routes/reportsRoutes.js`
- **Utils**: `utils/exportUtils.js` - CSV/PDF generation

## API Endpoints

### Sales Reports

#### GET `/api/reports/sales/summary`
Get aggregated sales summary (today, week, month).

**Response:**
```json
{
  "success": true,
  "data": {
    "today": { "revenue": 1000.00, "orders": 10, "items_sold": 50 },
    "week": { "revenue": 5000.00, "orders": 50, "items_sold": 250 },
    "month": { "revenue": 20000.00, "orders": 200, "items_sold": 1000 }
  }
}
```

#### GET `/api/reports/sales/daily?days=7`
Get daily sales trends.

#### GET `/api/reports/sales/weekly`
Get weekly trends grouped by day of week.

#### GET `/api/reports/sales/monthly?months=6`
Get monthly sales trends.

### Inventory Reports

#### GET `/api/reports/inventory/low-stock`
Get low stock items (quantity > 0 AND < min_stock_level).

#### GET `/api/reports/inventory/out-of-stock`
Get out of stock items (quantity = 0).

#### GET `/api/reports/inventory/expiring?days=60`
Get products expiring within N days.

#### GET `/api/reports/inventory/valuation`
Get total inventory valuation.

### Product Performance

#### GET `/api/reports/products/top-selling?limit=10`
Get top selling products by volume.

#### GET `/api/reports/products/dead`
Get dead stock (not sold in 30 days).

#### GET `/api/reports/products/category-sales`
Get category sales breakdown.

### Export Reports

#### GET `/api/reports/export/csv?type=sales-daily`
Export report as CSV.

**Query Parameters:**
- `type` (required) - Report type
- `days`, `months`, `limit` - Type-specific parameters

#### GET `/api/reports/export/pdf?type=low-stock`
Export report as PDF.

**Roles:**
- Sales and product performance reports require `admin` or `staff` role.
- Inventory reports and exports (low stock, out-of-stock, expiring, valuation) are available to `admin`, `staff`, and `purchasing` roles.

## Historical Pricing

Reports use `order_items.unit_price_at_sale` for historical accuracy, ensuring reports reflect prices at time of sale.

## Related Documentation
- [Stock Management](03-stock-management.md)
- [Orders](05-orders.md)
- [Database Schema](../database/02-tables.md)

