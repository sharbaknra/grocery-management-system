# Grocery Management System - User Guide

A complete guide to using the Grocery Management System (GMS) for daily store operations.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [User Roles](#user-roles)
3. [Store Manager Guide](#store-manager-guide)
4. [Cashier Guide](#cashier-guide)
5. [Purchasing Agent Guide](#purchasing-agent-guide)
6. [Features Overview](#features-overview)

---

## Getting Started

### Accessing the System

1. Open your web browser (Chrome, Firefox, Edge)
2. Go to: `http://localhost:3000`
3. You will see the home page with role selection options
4. Click "Log In" or select your role card to proceed to login

### Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Store Manager | admin@grocery.com | admin123 |
| Staff | staff@grocery.com | staff123 |
| Purchasing Agent | purchasing@grocery.com | purchasing123 |

### First-Time Login

1. Enter your email address
2. Enter your password
3. Click "Log In"
4. You will be redirected to your role-specific dashboard

---

## User Roles

The system has three main user roles, each with different responsibilities and access levels.

### Store Manager
The Store Manager has full control over the system. They can:
- Add, edit, and delete products
- View and manage inventory levels
- Access all sales and financial reports
- Manage supplier information
- View billing and invoices
- Configure system settings

### Cashier / POS Operator
The Cashier handles day-to-day sales. They can:
- Process customer sales using the Point of Sale (POS) system
- Add products to cart and complete transactions
- View order history
- Print receipts and invoices
- Handle cash and card payments
> Note: Cashiers/Staff do **not** perform manual stock adjustments; all non-sale stock corrections are handled by Store Managers.

### Purchasing Agent
The Purchasing Agent manages stock replenishment. They can:
- View current stock levels
- See which items need reordering
- Manage supplier contacts
- Create and track purchase orders
- Monitor low-stock alerts and inventory status via the Stock Levels and Reports pages (read-only access to inventory reports)

---

## Store Manager Guide

### Dashboard Overview

When you log in as a Store Manager, you'll see:

- **Today's Sales**: Total revenue from today's transactions
- **Total Orders**: Number of orders processed
- **Low Stock Items**: Products that need restocking
- **Total Products**: Number of products in the system

### Managing Products

#### Adding a New Product
1. Click **"Products"** in the sidebar
2. Click **"Add Product"** button
3. Fill in the product details:
   - Product name
   - Category (Fruits, Vegetables, Dairy, etc.)
   - Price (in PKR)
   - Barcode (optional)
   - Description
   - Expiry date (if applicable)
   - Supplier (select from list)
   - Product image (optional)
4. Click **"Save Product"**

#### Editing a Product
1. Go to **Products** page
2. Find the product you want to edit
3. Click the **Edit** (pencil) icon
4. Make your changes
5. Click **"Update Product"**

#### Deleting a Product
1. Go to **Products** page
2. Find the product
3. Click the **Delete** (trash) icon
4. Confirm deletion

### Managing Stock Levels

#### Viewing Stock
1. Click **"Stock Levels"** in the sidebar
2. See all products with their current quantities
3. Items highlighted in red/orange are low on stock

#### Restocking Products
1. Go to **Stock Levels**
2. Find the product to restock
3. Click **"Restock"** button
4. Enter the quantity to add
5. Add a reason (optional)
6. Click **"Confirm"**

### Viewing Reports

#### Accessing Reports
1. Click **"Reports"** in the sidebar
2. Choose report type:
   - **Sales Summary**: Overview of sales performance
   - **Daily Sales**: Day-by-day breakdown
   - **Monthly Sales**: Month-by-month trends
   - **Top Products**: Best-selling items
   - **Low Stock**: Items needing reorder
   - **Inventory Valuation**: Total stock value

#### Exporting Reports
1. Open any report
2. Click **"Export CSV"** for spreadsheet format
3. Click **"Export PDF"** for printable format

### Managing Suppliers

#### Adding a Supplier
1. Click **"Suppliers"** in the sidebar
2. Click **"Add Supplier"**
3. Enter supplier details:
   - Company name
   - Contact person
   - Phone number
   - Email address
   - Address
   - Lead time (days to deliver)
   - Minimum order amount
4. Click **"Save"**

#### Viewing Supplier Details
1. Go to **Suppliers** page
2. Click on a supplier name
3. See contact info, linked products, and order history

### Billing & Invoices

#### Viewing Invoices
1. Click **"Billing"** in the sidebar
2. See all sales invoices with:
   - Invoice number (e.g., INV-202511-00001)
   - Customer name
   - Date and time
   - Total amount
   - Status (Completed/Pending)

#### Filtering Invoices
- **By Status**: Select Completed, Pending, or Cancelled
- **By Date**: Choose Today, This Week, This Month, or This Year
- **By Search**: Type invoice number or customer name

#### Printing an Invoice
1. Find the invoice in the list
2. Click the **Print** icon
3. A print-friendly invoice will open
4. Use your browser's print function (Ctrl+P)

#### Exporting Invoices
1. Go to **Billing** page
2. Apply any filters you need
3. Click **"Export CSV"**
4. Save the file to your computer

---

## Cashier Guide

### Point of Sale (POS) System

The POS is your main workspace for processing sales.

#### Processing a Sale

**Step 1: Find Products**
- Use the search bar to find products by name
- Or browse by category using the dropdown
- Click on a product to add it to the cart

**Step 2: Manage Cart**
- Products appear in the cart on the right
- Use **+** and **-** buttons to adjust quantity
- Click the **X** to remove an item
- See the running total at the bottom

**Step 3: Complete Payment**
1. Select payment method (Cash or Card)
2. Click **"Complete Sale"**
3. Sale is recorded and stock is automatically updated

**Step 4: Receipt**
- A success message shows the order number
- Click **"Print Receipt"** if needed
- Click **"New Sale"** to start the next transaction

#### Viewing Order History

1. Click **"Orders"** in the sidebar
2. See all completed orders
3. Click on an order to view details
4. Print invoice if customer requests

### Tips for Cashiers

- **Quick Search**: Type the first few letters of a product name
- **Barcode**: If you have a barcode scanner, scan products directly
- **Clear Cart**: Use "Clear All" to start over if needed
- **Out of Stock**: Products with zero stock won't appear in the POS

---

## Purchasing Agent Guide

### Purchasing Dashboard

Your dashboard shows:
- **Total Suppliers**: Number of registered suppliers
- **Low Stock Items**: Products below minimum level
- **Out of Stock**: Products with zero quantity
- **Pending Reorders**: Orders waiting to be fulfilled

### Checking Stock Levels

1. Click **"Stock Levels"** in the sidebar
2. View all products and their quantities
3. Red items = Out of stock (urgent)
4. Orange items = Low stock (order soon)
5. Green items = Well stocked

### Managing Suppliers

#### Viewing Supplier List
1. Click **"Suppliers"** in the sidebar
2. See all suppliers with contact info
3. Click on a supplier for full details

#### Adding New Supplier
1. Click **"Add Supplier"**
2. Fill in company and contact details
3. Set lead time (how many days they take to deliver)
4. Set minimum order amount if applicable
5. Click **"Save"**

### Creating Reorders

#### Using the Reorder Dashboard
1. Click **"Reorder"** in the sidebar
2. See items grouped by supplier
3. Each item shows:
   - Current stock level
   - Minimum required level
   - Suggested order quantity
4. Use this list to contact suppliers

#### Manual Reorder Process
1. Identify items needing restock from the dashboard
2. Note the supplier for each item
3. Contact supplier via phone/email
4. Place order for required quantities
5. When stock arrives, ask Store Manager to update inventory

---

## Features Overview

### Products
- Full product catalog with images
- Categories: Fruits, Vegetables, Dairy, Bakery, Meat, Beverages, Spices, Pulses, Rice, Snacks
- Price management in Pakistani Rupees (PKR)
- Barcode support
- Expiry date tracking

### Inventory
- Real-time stock tracking
- Automatic updates when sales occur
- Low stock alerts
- Stock movement history
- Minimum stock level settings

### Sales & POS
- Fast product search
- Category filtering
- Shopping cart management
- Cash and card payment options
- Automatic receipt generation

### Billing
- Professional invoice generation
- Invoice numbering system
- Print-ready invoices
- CSV export for accounting
- Filter by date and status

### Reports
- Sales summaries (daily, weekly, monthly)
- Top-selling products
- Dead stock identification
- Inventory valuation
- Low stock reports
- Export to CSV and PDF

### Suppliers
- Supplier directory
- Contact management
- Lead time tracking
- Linked products view
- Reorder suggestions

---

## Common Tasks Quick Reference

| Task | Steps |
|------|-------|
| Process a sale | POS → Add items → Select payment → Complete Sale |
| Add new product | Products → Add Product → Fill form → Save |
| Check low stock | Stock Levels → Look for red/orange items |
| Print invoice | Billing → Find order → Click Print icon |
| View daily sales | Reports → Sales Summary → Select "Today" |
| Add supplier | Suppliers → Add Supplier → Fill form → Save |
| Restock item | Stock Levels → Find item → Click Restock → Enter quantity |

---

## Troubleshooting

### Can't Log In
- Check email spelling
- Ensure password is correct (passwords are case-sensitive)
- Contact administrator if locked out

### Product Not Showing in POS
- Product may be out of stock
- Check if product is marked as active
- Try refreshing the page

### Invoice Not Printing
- Check printer connection
- Try "Save as PDF" option
- Use browser print function (Ctrl+P)

### Stock Not Updating
- Refresh the page
- Check if sale was completed successfully
- Contact administrator if issue persists

---

## Support

**System developed by:**
- Muhammad Saad Ali (BSE-F23-E25)
- Qalab-e-Abbas (BSE-F23-E24)

**University of Mianwali**
Database Systems Project - 2025

---

© 2025 Grocery Management System - Made by Saad Ali

