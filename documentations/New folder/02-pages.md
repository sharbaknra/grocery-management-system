# Frontend Pages

## Page Components

### Authentication Pages
- **Login** (`login`) - User authentication
- **Register** (`register`) - User registration

### Dashboard Pages
- **Manager Dashboard** (`manager-dashboard`) - KPIs, low stock alerts, recent orders
- **POS** (`pos`) - Point of Sale interface for staff
- **Purchasing Dashboard** (`purchasing-dashboard`) - Reorder dashboard for purchasing agents

### Product Pages
- **Products List** (`products`) - Browse/search products
- **Product Detail** (`product-detail`) - Product information
- **Product Form** (`product-form`) - Create/edit products

### Stock Pages
- **Stock Levels** (`stock`) - View and update stock levels

### Supplier Pages
- **Suppliers List** (`suppliers`) - Supplier directory
- **Supplier Detail** (`supplier-detail`) - Supplier information
- **Supplier Form** (`supplier-form`) - Create/edit suppliers
- **Reorder Dashboard** (`reorder-dashboard`) - Reorder grouped by supplier

### Order Pages
- **Orders History** (`orders`) - Order list
- **Order Detail** (`order-detail`) - Order information

### Billing Pages
- **Billing & Invoices** (`billing`) - Invoice list
- **Invoice Detail** (`invoice-detail`) - Invoice information

### Reports Pages
- **Reports** (`reports`) - Sales and inventory reports

### Staff Management Pages
- **Staff List** (`staff-list`) - List staff members
- **Staff Form** (`staff-form`) - Create/edit staff
- **Staff Detail** (`staff-detail`) - Staff information

### Other Pages
- **Home** (`home`) - Landing page
- **Settings** (`settings`) - User settings

## Page Structure

Each page follows this pattern:
```javascript
function pageName() {
  return {
    html: `<div>Page HTML</div>`,
    onMount: () => {
      // Initialize page
      // Fetch data
      // Attach event listeners
    }
  };
}
```

## Related Documentation
- [Architecture](01-architecture.md)
- [Routing](05-routing.md)
- [Services](03-services.md)

