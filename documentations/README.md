# Grocery Management System - Documentation Index

Welcome to the comprehensive documentation for the Grocery Management System (GMS). This documentation is organized by system layer (Backend, Database, Frontend) and provides detailed information about architecture, APIs, data structures, and usage patterns.

## Documentation Structure

### Backend Documentation
- [01-authentication.md](backend/01-authentication.md) - JWT authentication, user management, login/logout flows
- [02-products.md](backend/02-products.md) - Product CRUD operations, image upload, barcode handling
- [03-stock-management.md](backend/03-stock-management.md) - Stock operations, restock/reduce, low stock alerts
- [04-suppliers.md](backend/04-suppliers.md) - Supplier management and purchasing workflows
- [05-orders.md](backend/05-orders.md) - Order creation, history, status management
- [06-cart.md](backend/06-cart.md) - Shopping cart operations
- [07-checkout.md](backend/07-checkout.md) - Checkout process, payment, order completion
- [08-reports.md](backend/08-reports.md) - Sales reports, inventory reports, analytics
- [09-api-reference.md](backend/09-api-reference.md) - Complete API endpoint reference with examples
- [10-middleware.md](backend/10-middleware.md) - Auth, role, upload middleware documentation

### Database Documentation
- [01-schema-overview.md](database/01-schema-overview.md) - Database architecture, ER diagrams, relationships
- [02-tables.md](database/02-tables.md) - Detailed table definitions, columns, constraints
- [03-indexes.md](database/03-indexes.md) - Index definitions and performance optimization
- [04-migrations.md](database/04-migrations.md) - Migration history and procedures
- [05-data-flow.md](database/05-data-flow.md) - Data flow diagrams, transaction handling

### Frontend Documentation
- [01-architecture.md](frontend/01-architecture.md) - Frontend structure, routing, state management
- [02-pages.md](frontend/02-pages.md) - All page components and their functionality
- [03-services.md](frontend/03-services.md) - API client, service layer, error handling
- [04-state-management.md](frontend/04-state-management.md) - App state, user session, cart state
- [05-routing.md](frontend/05-routing.md) - Route definitions, role-based access, navigation
- [06-components.md](frontend/06-components.md) - Reusable components and templates
- [07-user-guide.md](frontend/07-user-guide.md) - User-facing documentation for each role

## Quick Start

### For Backend Developers
Start with [09-api-reference.md](backend/09-api-reference.md) for a complete API overview, then dive into specific modules as needed.

### For Database Administrators
Begin with [01-schema-overview.md](database/01-schema-overview.md) to understand the database structure, then review [02-tables.md](database/02-tables.md) for detailed table definitions.

### For Frontend Developers
Start with [01-architecture.md](frontend/01-architecture.md) to understand the frontend structure, then review [02-pages.md](frontend/02-pages.md) for page-specific documentation.

## System Overview

The Grocery Management System is a full-stack application built with:
- **Backend**: Node.js + Express.js + MySQL
- **Frontend**: Vanilla JavaScript (ES6+), Tailwind CSS
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Local file system (uploads directory)

### Key Features
- Role-based access control (Admin, Manager, Staff, Purchasing Agent, Customer)
- Real-time inventory tracking
- Product management with image uploads
- Supplier management and purchasing workflows
- Order processing and checkout
- Sales and inventory reporting
- Shopping cart functionality

## Default Credentials

For development/testing purposes:
- **Admin/Manager**: `admin@grocery.com` / `admin123`
- **Staff**: `staff@grocery.com` / `staff123`
- **Purchasing Agent**: `purchasing@grocery.com` / `purchasing123`

## API Base URL

```
http://localhost:3000/api
```

## Related Documentation

- [Main README.md](../../README.md) - Project setup and installation
- [CODE_DOCUMENTATION.md](../../CODE_DOCUMENTATION.md) - Legacy code documentation
- [USER_GUIDE.md](../../USER_GUIDE.md) - End-user guide
