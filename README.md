# Grocery Management System - Backend

A comprehensive backend system for managing grocery store operations including products, inventory, orders, sales, and analytics.

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Default Credentials](#default-credentials)
- [Installation Guide](#installation-guide)
- [Development](#development)

## ✨ Features

### Core Functionality
- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Admin, Staff, Customer)
  - Secure password hashing with bcrypt
  - Token blacklisting for logout

- **Product Management**
  - Complete CRUD operations for products
  - Image upload and processing
  - Barcode support with unique constraints
  - Category-based organization

- **Inventory Management**
  - Real-time stock tracking
  - Atomic stock operations (restock/reduce)
  - Low stock alerts
  - Stock movement audit trail

- **Order & Sales System**
  - Persistent shopping cart
  - ACID-compliant checkout process
  - Order history with role-based access
  - Historical price tracking (unit_price_at_sale)

- **Reports & Analytics**
  - Sales reports (daily, weekly, monthly)
  - Inventory reports (low stock, out of stock, expiring products)
  - Product performance metrics
  - CSV and PDF export capabilities

## 🛠 Technology Stack

- **Runtime:** Node.js (14.x or higher, recommended 18.x LTS)
- **Framework:** Express.js
- **Database:** MySQL (5.7 or higher, recommended 8.0)
- **Authentication:** JWT (JSON Web Tokens)
- **File Upload:** Multer
- **PDF Generation:** PDFKit
- **CSV Export:** csv-stringify

## 📦 Prerequisites

Before running the application, ensure you have:

1. **Node.js** (14.x or higher)
   - Download from: https://nodejs.org/
   - Verify: `node --version`

2. **MySQL** (5.7 or higher)
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Or use XAMPP: https://www.apachefriends.org/
   - Verify: `mysql --version`

3. **MySQL Workbench** (Optional but recommended)
   - Download from: https://dev.mysql.com/downloads/workbench/

## 🚀 Quick Start

### 1. Extract/Clone the Project

Extract the project ZIP file or clone the repository to your desired location.

### 2. Configure Environment

1. Copy `.env.example` to `.env`
2. Edit `.env` and set your MySQL password:
   ```env
   DB_PASSWORD=your_mysql_password_here
   ```

### 3. Set Up Database

**Option A: Using reset-db.bat (Recommended)**
- Double-click `reset-db.bat`
- Enter your MySQL root password when prompted

**Option B: Using MySQL Workbench**
- Open MySQL Workbench
- Connect to your MySQL server
- File → Run SQL Script → Select `database/grocery_db.sql`
- Click Execute

**Option C: Using Command Line**
```bash
mysql -u root -p < database/grocery_db.sql
```

### 4. Start the Server

Double-click `start.bat` or run:
```bash
npm install
npm start
```

The server will start on `http://localhost:3000` (or the port specified in `.env`).

## 📁 Project Structure

```
grocery-management-system/
├── config/
│   └── db.js                 # Database configuration
├── controllers/              # Request handlers
│   ├── cartController.js
│   ├── checkoutController.js
│   ├── orderHistoryController.js
│   ├── productController.js
│   ├── reportsController.js
│   ├── stockController.js
│   └── userController.js
├── database/
│   ├── grocery_db.sql        # Complete database dump
│   └── migrations/           # Database migration scripts
├── middleware/
│   ├── authMiddleware.js     # JWT authentication
│   ├── roleMiddleware.js     # Role-based access control
│   └── uploadMiddleware.js  # File upload handling
├── models/                   # Database models
│   ├── cartModel.js
│   ├── orderModel.js
│   ├── productModel.js
│   ├── reportsModel.js
│   ├── stockModel.js
│   └── userModel.js
├── routes/                   # API routes
│   ├── cartRoutes.js
│   ├── orderRoutes.js
│   ├── productRoutes.js
│   ├── reportsRoutes.js
│   ├── stockRoutes.js
│   └── userRoutes.js
├── utils/
│   ├── exportUtils.js       # CSV/PDF export utilities
│   └── tokenBlacklist.js    # Token blacklist management
├── uploads/                  # Uploaded product images
├── .env.example              # Environment variables template
├── start.bat                 # Windows startup script
├── reset-db.bat              # Database reset script
├── package.json              # Dependencies
├── server.js                 # Application entry point
└── README.md                 # This file
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login and get JWT token
- `POST /api/users/logout` - Logout and blacklist token

### Product Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products/create` - Create product (Admin only)
- `PUT /api/products/update/:id` - Update product (Admin only)
- `DELETE /api/products/delete/:id` - Delete product (Admin only)

### Stock Endpoints
- `GET /api/stock` - Get inventory
- `GET /api/stock/low-stock` - Get low stock items (Admin/Staff)
- `POST /api/stock/restock` - Restock product (Admin only)
- `POST /api/stock/reduce` - Reduce stock (Admin/Staff)

### Order Endpoints
- `GET /api/orders` - Get all orders (Admin/Staff)
- `GET /api/orders/me` - Get user's orders (Customer)
- `GET /api/orders/:orderId` - Get order by ID
- `POST /api/orders/cart/add` - Add item to cart
- `POST /api/orders/checkout` - Checkout cart

### Reports Endpoints (Admin/Staff only)
- `GET /api/reports/sales/summary` - Sales summary
- `GET /api/reports/sales/daily` - Daily sales trends
- `GET /api/reports/sales/weekly` - Weekly sales trends
- `GET /api/reports/sales/monthly` - Monthly sales trends
- `GET /api/reports/inventory/low-stock` - Low stock report
- `GET /api/reports/inventory/out-of-stock` - Out of stock report
- `GET /api/reports/inventory/expiring` - Expiring products
- `GET /api/reports/inventory/valuation` - Inventory valuation
- `GET /api/reports/products/top-selling` - Top selling products
- `GET /api/reports/products/dead` - Dead stock report
- `GET /api/reports/products/category-sales` - Category sales breakdown
- `GET /api/reports/export/csv?type={type}` - Export CSV
- `GET /api/reports/export/pdf?type={type}` - Export PDF

### Authentication
Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 🔐 Default Credentials

The database comes pre-populated with default accounts:

### Admin Account
- **Email:** `admin@grocery.com`
- **Password:** `admin123`
- **Role:** Admin (Full access)

### Staff Account
- **Email:** `staff@grocery.com`
- **Password:** `staff123`
- **Role:** Staff (Read/Write on Stock and Orders)

**⚠️ Security Note:** Change these passwords in production!

## 📖 Installation Guide

For detailed installation instructions, see:
- **OFFLINE-INSTALLATION-GUIDE-WINDOWS.md** - Comprehensive step-by-step guide

## 💻 Development

### Running in Development Mode

```bash
npm install
npm run dev  # Uses nodemon for auto-reload
```

### Environment Variables

Create a `.env` file with the following variables:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=grocery_db
PORT=3000
JWT_SECRET=your_secret_key
NODE_ENV=development
```

### Database Migrations

Database migration scripts are located in `database/migrations/`. Run them manually using MySQL Workbench or command line.

### Testing

The project includes comprehensive test scripts:
- `test-backend-comprehensive.js` - Full backend API tests
- `test-module-2.11.2.js` - Windows scripts tests
- `test-module-2.11.3.js` - Installation guide tests

## 🗄️ Database Schema

The system uses the following main tables:
- `users` - User accounts and authentication
- `products` - Product catalog
- `stock` - Inventory levels
- `orders` - Order records
- `order_items` - Order line items
- `cart` - Shopping cart items
- `stock_movements` - Inventory audit trail

See `database/grocery_db.sql` for the complete schema.

## 📝 License

ISC

## 👥 Author

Grocery Management System Development Team

## 📞 Support

For issues or questions, refer to:
- **OFFLINE-INSTALLATION-GUIDE-WINDOWS.md** - Installation and troubleshooting
- Check console output for detailed error messages
- Verify all prerequisites are installed correctly

---

**Last Updated:** December 2024

