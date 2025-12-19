# Grocery Management System

A comprehensive full-stack system for managing grocery store operations including products, inventory, orders, sales, suppliers, and analytics. Built with Node.js/Express backend and vanilla JavaScript frontend.

## 📖 Overview

The Grocery Management System (GMS) is a database-driven software solution designed to help small grocery stores handle core operations including inventory management, sales processing, supplier tracking, and business analytics. The system replaces manual, paper-based processes with a reliable digital platform, significantly improving efficiency, reducing errors, and providing managers with clear data for better decision-making.

### Key Benefits
- **Centralized Data Management:** All store operations in one platform
- **Real-time Inventory Tracking:** Immediate stock updates with low-stock alerts
- **ACID-Compliant Transactions:** Guaranteed data integrity for financial records
- **Comprehensive Reporting:** Sales, inventory, and product performance analytics
- **Supplier Integration:** Automated reorder sheet generation
- **Role-Based Access:** Secure multi-user system with Admin, Staff, and Customer roles

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Default Credentials](#default-credentials)
- [Installation Guide](#installation-guide)
- [Frontend](#frontend)
- [Development](#development)
- [Database Schema](#database-schema)
- [License](#license)

## ✨ Features

### Core Functionality

#### User Authentication & Authorization
- JWT-based authentication with secure token management
- Role-based access control (Admin, Staff, Customer)
- Secure password hashing with bcrypt (10 salt rounds)
- Token blacklisting for secure logout
- Session management with configurable token expiration

#### Product Management
- Complete CRUD operations for products
- Image upload and processing with Multer
- Barcode support with unique constraints
- Category-based organization
- Supplier linking for purchasing workflows
- Product detail pages with stock information

#### Inventory Management
- Real-time stock tracking with atomic operations
- ACID-compliant stock adjustments (restock/reduce)
- Low stock alerts with configurable thresholds
- Out-of-stock detection
- Stock movement audit trail for compliance
- Expiring products tracking (60-day lookahead)
- Inventory valuation reports

#### Supplier Management & Purchasing
- Dedicated supplier directory with contact details
- Lead time and minimum order tracking
- Supplier-aware product catalog
- Automated reorder sheet generation grouped by supplier
- Supplier-specific purchasing dashboards
- Supplier order history tracking
- Role-gated APIs for purchasing workflows

#### Order & Sales System
- Persistent shopping cart (database-backed)
- ACID-compliant checkout process with transaction rollback
- Multi-step order processing with inventory validation
- Order history with role-based access
- Historical price tracking (unit_price_at_sale) for audit trails
- Order status management (Pending, Completed, Cancelled)
- Customer order tracking

#### Reports & Analytics
- **Sales Reports:**
  - Daily, weekly, and monthly sales trends
  - Sales summary with aggregated metrics
  - Revenue calculations using historical prices
- **Inventory Reports:**
  - Low stock alerts
  - Out-of-stock items
  - Expiring products (configurable timeframe)
  - Inventory valuation
- **Product Performance:**
  - Top selling products by volume
  - Dead stock identification (30-day lookback)
  - Category sales breakdown
- **Export Capabilities:**
  - CSV export (RFC 4180 compliant)
  - PDF export with professional formatting

## 🛠 Technology Stack

### Backend
- **Runtime:** Node.js (14.x or higher, recommended 18.x LTS)
- **Framework:** Express.js 5.x
- **Database:** MySQL (5.7 or higher, recommended 8.0)
- **Authentication:** JWT (JSON Web Tokens) with jsonwebtoken
- **Password Hashing:** bcrypt
- **File Upload:** Multer
- **PDF Generation:** PDFKit
- **CSV Export:** csv-stringify
- **Environment Management:** dotenv

### Frontend
- **Framework:** Vanilla JavaScript (ES6+ modules)
- **Styling:** Tailwind CSS
- **Build Tool:** PostCSS with Autoprefixer
- **Architecture:** Single Page Application (SPA) with client-side routing

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

### Prerequisites Check

Before starting, ensure you have:
- Node.js installed (`node --version` should show 14.x or higher)
- MySQL installed and running (`mysql --version`)
- MySQL root password (or empty password)

### Step 1: Extract/Clone the Project

Extract the project ZIP file or clone the repository to your desired location:
```bash
git clone <repository-url>
cd grocery-management-system
```

### Step 2: Configure Environment

1. Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env  # Windows
   # or
   cp .env.example .env    # Linux/Mac
   ```

2. Edit `.env` and set your MySQL password:
   ```env
   DB_PASSWORD=your_mysql_password_here
   ```
   If your MySQL root has no password, leave it empty: `DB_PASSWORD=`

### Step 3: Set Up Database

**Option A: Using reset-db.bat (Recommended for Windows)**
- Double-click `reset-db.bat`
- Enter your MySQL root password when prompted (or press Enter if no password)
- Wait for "Database reset successful!" message

**Option B: Using MySQL Workbench**
1. Open MySQL Workbench
2. Connect to your MySQL server (usually `localhost:3306`)
3. File → Run SQL Script → Select `database/grocery_db.sql`
4. Click Execute (⚡ icon)
5. Verify tables were created in the left sidebar

**Option C: Using Command Line**
```bash
mysql -u root -p < database/grocery_db.sql
# Enter your MySQL root password when prompted
```

### Step 4: Start the Backend Server

**Windows:**
- Double-click `start.bat`
- Or run in terminal:
  ```bash
  npm install
  npm start
  ```

**Linux/Mac:**
```bash
npm install
npm start
```

The server will start on `http://localhost:5000` by default (or the port specified in `.env`).

You should see:
```
🚀 Server running on port 5000
```

### Step 5: Access the Application

**Backend API:**
- Base URL: `http://localhost:5000/api` (default port, configurable)
- Test endpoint: `http://localhost:5000/api/products` (requires authentication)

**Frontend:**
- Open `frontend/index.html` in a browser
- Or run a local server: `npx serve frontend`
- Login with default credentials (see [Default Credentials](#default-credentials))

### Step 6: Verify Installation

1. **Test Backend Connection:**
   ```bash
   # Login to get token
   curl -X POST http://localhost:5000/api/users/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@grocery.com","password":"admin123"}'
   ```

2. **Test Products Endpoint:**
   - Use the token from step 1 in Authorization header
   - GET `http://localhost:5000/api/products`

3. **Check Database:**
   - Connect to MySQL and verify tables exist:
     ```sql
     USE grocery_db;
     SHOW TABLES;
     SELECT COUNT(*) FROM products;
     ```

## 📁 Project Structure

```
grocery-management-system/
├── config/
│   └── db.js                 # Database configuration
├── controllers/              # Request handlers
│   ├── cartController.js
│   ├── checkoutController.js
│   ├── itemController.js
│   ├── orderHistoryController.js
│   ├── productController.js
│   ├── reportsController.js
│   ├── stockController.js
│   ├── supplierController.js
│   └── userController.js
├── database/
│   ├── grocery_db.sql        # Complete database dump
│   └── migrations/           # Database migration scripts
├── frontend/                 # Frontend application
│   ├── index.html            # App shell
│   ├── src/
│   │   ├── pages/            # Route-level modules
│   │   ├── services/         # API clients
│   │   ├── state/            # State management
│   │   └── styles/           # CSS styles
│   └── docs/                 # Frontend documentation
├── middleware/
│   ├── adminMiddleware.js    # Admin-only access
│   ├── authMiddleware.js     # JWT authentication
│   ├── roleMiddleware.js     # Role-based access control
│   └── uploadMiddleware.js   # File upload handling
├── models/                   # Database models
│   ├── cartModel.js
│   ├── itemModel.js
│   ├── orderItemModel.js
│   ├── orderModel.js
│   ├── productModel.js
│   ├── reportsModel.js
│   ├── stockModel.js
│   ├── supplierModel.js
│   └── userModel.js
├── routes/                   # API routes
│   ├── cartRoutes.js
│   ├── itemRoutes.js
│   ├── orderRoutes.js
│   ├── productRoutes.js
│   ├── reportsRoutes.js
│   ├── stockRoutes.js
│   ├── supplierRoutes.js
│   └── userRoutes.js
├── utils/
│   ├── exportUtils.js        # CSV/PDF export utilities
│   └── tokenBlacklist.js     # Token blacklist management
├── uploads/                  # Uploaded product images
├── .env.example              # Environment variables template
├── start.bat                 # Windows startup script
├── reset-db.bat              # Database reset script
├── package.json              # Backend dependencies
├── server.js                 # Application entry point
└── README.md                 # This file
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```
(Default port is 5000, configurable via PORT in `.env`)

### Authentication Endpoints
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login and get JWT token
- `POST /api/users/logout` - Logout and blacklist token

### Product Endpoints
- `GET /api/products` - Get all products with stock information
- `GET /api/products/:id` - Get product by ID with stock details
- `POST /api/products/create` - Create product (Admin only)
  - Supports image upload via multipart/form-data
  - Optional `supplierId` to link product with supplier
- `PUT /api/products/update/:id` - Update product (Admin only)
  - Supports image update via multipart/form-data
- `DELETE /api/products/delete/:id` - Delete product (Admin only)
  - Cascades to stock records (ON DELETE CASCADE)

### Supplier & Purchasing Endpoints (Module 2.8.4)
- `GET /api/suppliers` - Supplier directory with product/low-stock counts (Admin/Staff)
- `POST /api/suppliers` - Create supplier (Admin)
- `PUT /api/suppliers/:id` - Update supplier (Admin)
- `DELETE /api/suppliers/:id` - Delete supplier (Admin)
- `GET /api/suppliers/:id` - Supplier details including products and order history (Admin/Staff)
- `GET /api/suppliers/reorder` - Purchasing dashboard with reorder groups per supplier (Admin/Staff)
- `GET /api/suppliers/:id/reorder` - Supplier-specific reorder sheet (Admin/Staff)

### Stock Endpoints
- `GET /api/stock` - Get complete inventory with product details
- `GET /api/stock/low-stock` - Get low stock items (Admin/Staff)
  - Returns products where quantity <= min_stock_level
  - Includes supplier metadata for purchasing workflows
- `POST /api/stock/restock` - Restock product (Admin only)
  - Atomic operation: `{ productId, quantity }`
- `POST /api/stock/reduce` - Reduce stock (Admin/Staff)
  - Atomic operation with non-negative validation
  - Prevents stock from going below zero

### Order Endpoints
- `GET /api/orders` - Get all orders (Admin/Staff)
  - Returns orders with user information and aggregated items
- `GET /api/orders/me` - Get user's orders (Customer)
  - Returns only authenticated user's orders
- `GET /api/orders/:orderId` - Get order by ID
  - Role-based access (Admin/Staff: all orders, Customer: own orders)
- `POST /api/orders/cart/add` - Add item to cart
  - Validates product existence and stock availability
  - Persistent database-backed cart
- `POST /api/orders/checkout` - Checkout cart
  - ACID-compliant transaction
  - Validates stock, creates order, deducts inventory, logs movements
  - Clears cart upon success

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
- All low-stock and out-of-stock data now includes supplier metadata for faster purchasing calls.
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

## 🖥️ Frontend

The frontend is a vanilla JavaScript Single Page Application (SPA) that communicates with the Express backend API.

### Running the Frontend

1. **Ensure the backend is running** on `http://localhost:5000` (or configured port)

2. **Option A: Direct Browser Access**
   - Open `frontend/index.html` directly in a modern browser
   - Note: Some features may require a local server due to CORS

3. **Option B: Local Development Server** (Recommended)
   ```powershell
   # From project root
   npx serve frontend
   # Or using Python
   python -m http.server 8080 -d frontend
   ```

4. **Build CSS** (if using Tailwind)
   ```bash
   cd frontend
   npm install
   npm run css:build
   ```

### Frontend Architecture

- **Modular ES6 Modules:** Each page exports render/teardown functions
- **Service Layer:** API communication via `src/services/*Service.js`
- **State Management:** Centralized state in `src/state/appState.js`
- **Routing:** Client-side routing for SPA navigation
- **Styling:** Tailwind CSS with utility classes

For detailed frontend documentation, see `frontend/README.md` and `frontend/docs/`.

## 💻 Development

### Running in Development Mode

**Backend:**
```bash
npm install
npm run dev  # Uses nodemon for auto-reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev  # Watches CSS changes
```

### Environment Variables

Create a `.env` file in the project root with the following variables:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=grocery_db
PORT=5000
JWT_SECRET=your_secret_key
NODE_ENV=development
```

### Database Migrations

Database migration scripts are located in `database/migrations/`. Run them manually using MySQL Workbench or command line.

### Testing

The project includes comprehensive test scripts:
- `test-backend-comprehensive-final.js` - Full backend API tests
- `frontend/tests/e2e-test.js` - End-to-end frontend tests
- `frontend/tests/ui-stock-flows.js` - UI stock management tests

### Additional Scripts

- `link-orphan-products.js` - Link products without suppliers
- `check-reorder.js` - Check reorder requirements
- `clear-orders-and-invoices.js` - Clear test data

## 🗄️ Database Schema

The system uses the following main tables:

### Core Tables
- **`users`** - User accounts and authentication
  - Roles: Admin, Staff, Customer
  - Password hashing with bcrypt
  
- **`products`** - Product catalog
  - Barcode (unique), category, price, image_url
  - Links to suppliers via `supplier_id` (FK)
  
- **`stock`** - Inventory levels
  - Quantity, min_stock_level, expiry_date
  - Foreign key to products (ON DELETE CASCADE)
  
- **`suppliers`** - Supplier directory
  - Contact details, lead time, minimum order amount
  - Referenced by products (ON DELETE SET NULL)

### Transaction Tables
- **`orders`** - Order records
  - Status (Pending, Completed, Cancelled)
  - Total price, tax, discount
  - Links to users via `user_id` (FK)
  
- **`order_items`** - Order line items
  - Quantity, unit_price_at_sale (historical price)
  - Links to orders and products (FKs)
  
- **`cart`** - Shopping cart items
  - Persistent cart tied to user_id
  - Unique constraint on (user_id, product_id)

### Audit Tables
- **`stock_movements`** - Inventory audit trail
  - Tracks all stock changes (Restock, Reduce, Sale)
  - Includes user_id, timestamp, reason

### Relationships
- Products → Suppliers (many-to-one)
- Products → Stock (one-to-one)
- Users → Orders (one-to-many)
- Orders → Order Items (one-to-many)
- Products → Order Items (one-to-many)
- Users → Cart (one-to-many)

See `database/grocery_db.sql` for the complete schema with indexes and constraints.

## 📝 License

ISC

## 👥 Authors

**Muhammad Saad Ali** (Roll No: BSE-F23-E25) - Database Architect  
**Qalab-e-Abbas** (Roll No: BSE-F23-E24) - Requirements Analyst

University of Mianwali

## 📞 Support & Documentation

### Installation & Setup
- **OFFLINE-INSTALLATION-GUIDE-WINDOWS.md** - Comprehensive installation guide
- **USER_GUIDE.md** - User manual for end users
- **CODE_DOCUMENTATION.md** - Code documentation

### Technical Documentation
- **documentations/backend/** - Backend API documentation
- **documentations/frontend/** - Frontend architecture and components
- **documentations/database/** - Database schema and design
- **modules.md** - Complete module roadmap and specifications

### Troubleshooting

**Common Issues:**
1. **MySQL Connection Error:** Verify MySQL is running and check `.env` DB_PASSWORD
2. **Port Already in Use:** Change PORT in `.env` or stop the conflicting service
3. **Module Not Found:** Run `npm install` in project root
4. **Database Import Fails:** Ensure MySQL user has CREATE DATABASE privileges
5. **Token Expired:** Re-login to get a new JWT token

**Getting Help:**
- Check console output for detailed error messages
- Verify all prerequisites are installed correctly
- Review the installation guide for step-by-step troubleshooting
- Check database connection using MySQL Workbench

---

**Last Updated:** December 2024

