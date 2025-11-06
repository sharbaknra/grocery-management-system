

---


# 🛒 Grocery Management System (GMS)

A **database-driven management system** designed for small grocery stores to manage **inventory**, **suppliers**, **sales**, and **staff operations** in one centralized platform.  
Built with **MySQL**, **Node.js/Express**, and a **React (Vite)** frontend.

---

## 📖 Overview

The **Grocery Management System (GMS)** streamlines store operations by replacing manual record-keeping with a reliable, digital solution.  
It helps store managers and staff track stock levels, manage suppliers, and view summarized sales reports for better decision-making.

---

## 🚀 Features (Module 2.4)

### ✅ Core Features Implemented
- **Product Management** – Add, update, delete, and view grocery items.
- **Supplier Management** – Maintain supplier information and purchase history.
- **Inventory Control** – Auto-update stock quantities with each sale.
- **User Roles** – Manager and Cashier accounts for secure access.
- **Sales Reports** – View aggregated reports of daily/monthly sales performance.

### 🔜 Future Enhancements
- **Billing System** – Generate printable bills/invoices at checkout.
- **Analytics Dashboard** – Graphical sales trends and performance insights.
- **Barcode Integration** – For faster product lookup at the POS.
- **Cloud Deployment** – Public demo accessible online.

---

## 🧩 System Architecture

```

Frontend (React + Vite)  →  Backend (Node.js + Express)  →  Database (MySQL)

````

### 🧠 Tech Stack

| Layer | Technology | Description |
|-------|-------------|-------------|
| 🗄️ Database | MySQL | Reliable, open-source RDBMS for structured data storage |
| ⚙️ Backend | Node.js, Express.js | RESTful APIs for handling data and business logic |
| 💻 Frontend | React (Vite), TailwindCSS | Modern UI for smooth and fast user experience |
| 🧰 Tools | Postman, MySQL Workbench | For API testing and schema design |
| 🌍 Version Control | Git + GitHub | For version tracking and collaboration |

---

## ⚙️ Database Setup (MySQL)

1. Install **MySQL Server** and **MySQL Workbench**.
2. Create a new database:
   ```sql
   CREATE DATABASE grocery_management;


3. Import the provided `gms_schema.sql` file into the database.
4. Verify tables are created (products, suppliers, users, sales, etc.).
5. Insert test data if needed:

   ```sql
   INSERT INTO products (product_name, category, price, quantity) 
   VALUES ('Rice 5kg', 'Grains', 950, 25);
   ```

---

## 💻 Backend Setup (Node.js / Express)

1. Go to the backend folder:

   ```bash
   cd backend
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Create a `.env` file in the root of the backend folder:

   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=grocery_management
   PORT=5000
   ```
4. Start the backend server:

   ```bash
   npm run dev
   ```
5. Test using **Postman**:

   ```
   GET http://localhost:5000/api/products
   ```

---

## 🌐 Frontend Setup (React + Vite)

1. Go to the frontend folder:

   ```bash
   cd frontend
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Run the development server:

   ```bash
   npm run dev
   ```
4. Open browser and visit:

   ```
   http://localhost:5173
   ```

---

## 📊 Current Modules (as of Module 2.4)

| Module | Name            | Description                                        |
| :----- | :-------------- | :------------------------------------------------- |
| 1.0    | Database Design | Entity Relationship Diagram (ERD) and schema setup |
| 2.0    | Backend Setup   | Express server, routes, and database connection    |
| 2.2    | Product Module  | CRUD operations for products                       |
| 2.3    | Supplier Module | CRUD for supplier data and linking with products   |
| 2.4    | Sales & Reports | Sales recording and summarized reports             |


---

## 🪄 License

This project is open-source and free for educational use.

```
MIT License
Copyright (c) 2025
```

---

## 🧩 Folder Structure

```
grocery-management-system/
│
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   └── models/
│
├── frontend/
│   ├── src/
│   ├── components/
│   └── pages/
│
├── database/
│   └── gms_schema.sql
│
└── README.md
```

---

## 💬 Notes

* **Billing System** is *not included* (planned for later).
* Ensure MySQL is running before starting the backend.
* Always start backend **before** frontend when testing.

---

✨ *The Grocery Management System is a step toward digital transformation for local businesses — practical, lightweight, and built from scratch as an academic project.*

```

---

Would you like me to make a **README version with badges** (e.g. “Made with Node.js”, “MIT License”, “Open Source”, “MySQL”) that looks more like a real-world open-source repository header? It makes the project stand out on GitHub search results and looks polished.
```
