# Grocery Management System

A comprehensive full-stack grocery store management system with complete frontend and backend implementation. Built with Node.js/Express backend and vanilla JavaScript frontend.

## 📖 Overview

The Grocery Management System (GMS) is a production-ready software solution designed for small to medium grocery stores. It provides complete digital management of inventory, sales, suppliers, and business analytics, replacing manual processes with an efficient, reliable platform.

### Key Features

- **Complete Frontend Application** - Modern Single Page Application (SPA) with Tailwind CSS
- **RESTful Backend API** - Express.js with MySQL database
- **Role-Based Access Control** - Admin, Manager, Staff, Purchasing Agent, and Customer roles
- **Real-Time Inventory Tracking** - Automatic stock updates with low-stock alerts
- **Point of Sale (POS)** - Fast checkout system for staff
- **Comprehensive Reporting** - Sales, inventory, and product performance analytics
- **Supplier Management** - Automated reorder dashboards grouped by supplier
- **Secure Authentication** - JWT-based authentication with secure password hashing

## 🛠 Technology Stack

### Backend
- **Runtime:** Node.js (14.x or higher, recommended 18.x LTS)
- **Framework:** Express.js 5.x
- **Database:** MySQL (5.7 or higher, recommended 8.0)
- **Authentication:** JWT (JSON Web Tokens)
- **File Upload:** Multer
- **PDF Generation:** PDFKit
- **CSV Export:** csv-stringify

### Frontend
- **Framework:** Vanilla JavaScript (ES6+ modules)
- **Styling:** Tailwind CSS
- **Architecture:** Single Page Application (SPA) with client-side routing
- **Build Tool:** PostCSS with Autoprefixer

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

### Step 1: Clone the Repository

```bash
git clone https://github.com/sharbaknra/grocery-management-system.git
cd grocery-management-system
```

### Step 2: Configure Environment

1. Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env  # Windows
   cp .env.example .env    # Linux/Mac
   ```

2. Edit `.env` and configure your database:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=grocery_db
   PORT=5000
   JWT_SECRET=your_secret_key_here
   NODE_ENV=development
   ```

### Step 3: Set Up Database

**Option A: Using reset-db.bat (Windows)**
- Double-click `reset-db.bat`
- Enter your MySQL root password when prompted

**Option B: Using MySQL Workbench**
1. Open MySQL Workbench
2. Connect to your MySQL server
3. File → Run SQL Script → Select `database/grocery_db.sql`
4. Click Execute

**Option C: Using Command Line**
```bash
mysql -u root -p < database/grocery_db.sql
```

### Step 4: Install Dependencies

**Backend:**
```bash
npm install
```

**Frontend:**
```bash
cd frontend
npm install
npm run css:build
cd ..
```

### Step 5: Start the Application

**Start Backend Server:**
```bash
npm start
```

The server will start on `http://localhost:5000` (or your configured port).

**Start Frontend:**
```bash
# Option 1: Direct browser access
# Open frontend/index.html in your browser

# Option 2: Using a local server (Recommended)
npx serve frontend
# Or
python -m http.server 8080 -d frontend
```

### Step 6: Access the Application

- **Frontend:** Open `http://localhost:3000` (or your server port)
- **Backend API:** `http://localhost:5000/api`

## 🔐 Default Credentials

The database comes pre-populated with default accounts for testing:

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **Admin/Manager** | `admin@grocery.com` | `admin123` | Full system access |
| **Staff** | `staff@grocery.com` | `staff123` | POS, orders, billing |
| **Purchasing Agent** | `purchasing@grocery.com` | `purchasing123` | Suppliers, reorder dashboards |

**⚠️ Security Note:** Change these passwords in production!

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
│   ├── supplierController.js
│   └── userController.js
├── database/
│   ├── grocery_db.sql        # Complete database dump
│   └── migrations/           # Database migration scripts
├── frontend/                 # Frontend application
│   ├── index.html            # App entry point
│   ├── src/
│   │   ├── pages/            # Page components
│   │   ├── services/         # API service layer
│   │   ├── state/            # State management
│   │   └── styles/           # CSS styles
│   ├── dist/                 # Built CSS files
│   ├── tests/                # Test suites
│   └── docs/                 # Frontend documentation
├── middleware/               # Express middleware
│   ├── authMiddleware.js     # JWT authentication
│   ├── roleMiddleware.js     # Role-based access
│   └── uploadMiddleware.js   # File upload handling
├── models/                   # Database models
├── routes/                   # API routes
├── utils/                    # Utility functions
│   ├── exportUtils.js        # CSV/PDF export
│   └── pdfTheme.js           # PDF styling
├── uploads/                  # Uploaded product images
├── .env.example              # Environment template
├── package.json              # Backend dependencies
├── server.js                  # Application entry point
└── README.md                  # This file
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login and get JWT token
- `POST /api/users/logout` - Logout and blacklist token

### Product Endpoints
- `GET /api/products` - Get all products with stock information
- `GET /api/products/:id` - Get product by ID
- `POST /api/products/create` - Create product (Admin only)
- `PUT /api/products/update/:id` - Update product (Admin only)
- `DELETE /api/products/delete/:id` - Delete product (Admin only)

### Stock Endpoints
- `GET /api/stock` - Get complete inventory
- `GET /api/stock/low-stock` - Get low stock items
- `POST /api/stock/restock` - Restock product (Admin only)
- `POST /api/stock/reduce` - Reduce stock (Admin/Staff)

### Supplier Endpoints
- `GET /api/suppliers` - Get all suppliers
- `GET /api/suppliers/:id` - Get supplier details
- `GET /api/suppliers/reorder` - Get reorder dashboard
- `POST /api/suppliers` - Create supplier (Admin only)
- `PUT /api/suppliers/:id` - Update supplier (Admin only)
- `DELETE /api/suppliers/:id` - Delete supplier (Admin only)

### Order Endpoints
- `GET /api/orders` - Get all orders (Admin/Staff)
- `GET /api/orders/me` - Get user's orders (Customer)
- `GET /api/orders/:orderId` - Get order by ID
- `POST /api/orders/cart/add` - Add item to cart
- `POST /api/orders/checkout` - Checkout cart

### Reports Endpoints
- `GET /api/reports/sales/summary` - Sales summary
- `GET /api/reports/sales/daily` - Daily sales
- `GET /api/reports/sales/weekly` - Weekly sales
- `GET /api/reports/sales/monthly` - Monthly sales
- `GET /api/reports/inventory/low-stock` - Low stock report
- `GET /api/reports/inventory/out-of-stock` - Out of stock report
- `GET /api/reports/inventory/valuation` - Inventory valuation
- `GET /api/reports/products/top-selling` - Top selling products
- `GET /api/reports/export/csv?type={type}` - Export CSV
- `GET /api/reports/export/pdf?type={type}` - Export PDF

### Authentication
Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 🎯 Features by Role

### Admin/Manager
- Full system access
- Product management (CRUD)
- Stock level management
- Supplier management
- Staff account management
- Complete reporting and analytics
- Invoice and billing management

### Staff
- Point of Sale (POS) interface
- Process sales and checkout
- View order history
- View invoices
- Access products for sales

### Purchasing Agent
- View purchasing dashboard
- Supplier directory access
- Reorder dashboards (grouped by supplier)
- Stock levels (read-only)
- Inventory reports (read-only)

### Customer
- Browse products
- Add to cart
- Checkout
- View own order history

## 🧪 Testing

The project includes comprehensive test suites:

### Run E2E Tests
```bash
# Ensure backend is running on http://localhost:5000
node frontend/tests/e2e-test.js
```

### Run UI Stock Flow Tests
```bash
node frontend/tests/ui-stock-flows.js
```

### Run Backend Tests
```bash
node test-backend-comprehensive-final.js
```

## 💻 Development

### Development Mode

**Backend (with auto-reload):**
```bash
npm run dev
```

**Frontend (CSS watch mode):**
```bash
cd frontend
npm run dev
```

### Environment Variables

Create a `.env` file in the project root:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=grocery_db
PORT=5000
JWT_SECRET=your_secret_key
NODE_ENV=development
```

## 📖 Documentation

### User Documentation
- **USER_GUIDE.md** - Complete user manual
- **OFFLINE-INSTALLATION-GUIDE-WINDOWS.md** - Installation guide

### Technical Documentation
- **documentations/backend/** - Backend API documentation
- **documentations/frontend/** - Frontend architecture
- **documentations/database/** - Database schema
- **frontend/docs/** - Frontend-specific docs
- **CODE_DOCUMENTATION.md** - Code documentation

## 🗄️ Database Schema

### Core Tables
- **users** - User accounts and authentication
- **products** - Product catalog
- **stock** - Inventory levels
- **suppliers** - Supplier directory
- **orders** - Order records
- **order_items** - Order line items
- **cart** - Shopping cart items
- **stock_movements** - Inventory audit trail

See `database/grocery_db.sql` for the complete schema.

## 🔧 Additional Scripts

- `link-orphan-products.js` - Link products without suppliers
- `check-reorder.js` - Check reorder requirements
- `clear-orders-and-invoices.js` - Clear test data

## 🐛 Troubleshooting

### Common Issues

1. **MySQL Connection Error**
   - Verify MySQL is running
   - Check `.env` DB_PASSWORD
   - Ensure database exists

2. **Port Already in Use**
   - Change PORT in `.env`
   - Or stop the conflicting service

3. **Module Not Found**
   - Run `npm install` in project root
   - Run `npm install` in `frontend/` directory

4. **Database Import Fails**
   - Ensure MySQL user has CREATE DATABASE privileges
   - Check file path to `grocery_db.sql`

5. **Frontend Not Loading**
   - Ensure backend is running
   - Check CORS settings
   - Verify CSS is built (`npm run css:build` in frontend/)

## 📝 License

ISC

## 👥 Authors

**Muhammad Saad Ali** (Roll No: BSE-F23-E25) - Database Architect  
**Qalab-e-Abbas** (Roll No: BSE-F23-E24) - Requirements Analyst

University of Mianwali

## 📞 Support

For issues, questions, or contributions:
- Check the documentation in `documentations/` directory
- Review `USER_GUIDE.md` for user-facing questions
- See `CODE_DOCUMENTATION.md` for code-related questions

---

**Version:** 1.0.0  
**Last Updated:** December 2024  
**Status:** Production Ready ✅

