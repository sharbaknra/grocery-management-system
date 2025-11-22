# Grocery Management System - Offline Installation Guide (Windows)

This guide provides step-by-step instructions for setting up and running the Grocery Management System backend on a Windows machine. Follow these instructions carefully to ensure a successful installation.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Setup](#setup)
3. [Configuration](#configuration)
4. [Database Setup](#database-setup)
5. [Execution](#execution)
6. [Default Login Credentials](#default-login-credentials)
7. [Verification](#verification)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before installing the Grocery Management System, ensure you have the following software installed on your Windows machine:

### Required Software

1. **Node.js**
   - **Version:** 14.x or higher (recommended: 18.x LTS or higher)
   - **Download:** [https://nodejs.org/](https://nodejs.org/)
   - **Verification:** Open Command Prompt and run:
     ```bash
     node --version
     npm --version
     ```
   - Both commands should display version numbers.

2. **MySQL**
   - **Version:** 5.7 or higher (recommended: 8.0 or higher)
   - **Download:** [https://dev.mysql.com/downloads/mysql/](https://dev.mysql.com/downloads/mysql/)
   - **Alternative:** XAMPP (includes MySQL) - [https://www.apachefriends.org/](https://www.apachefriends.org/)
   - **Verification:** Open Command Prompt and run:
     ```bash
     mysql --version
     ```
   - Or check MySQL Workbench connection.

3. **MySQL Workbench (Optional but Recommended)**
   - **Download:** [https://dev.mysql.com/downloads/workbench/](https://dev.mysql.com/downloads/workbench/)
   - Useful for database management and SQL file import.

### System Requirements

- **Operating System:** Windows 10 or higher
- **RAM:** Minimum 4GB (8GB recommended)
- **Disk Space:** At least 500MB free space
- **Internet Connection:** Required only for initial npm package installation

---

## Setup

### Step 1: Extract the Project

1. If you received the project as a ZIP file, extract it to your desired location (e.g., `C:\Projects\grocery-management-system` or `E:\grocery-management-system`).

2. If you cloned from a repository, ensure you have the complete project structure.

### Step 2: Verify Project Structure

Ensure the following files and folders exist in the project root:

```
grocery-management-system/
├── config/
├── controllers/
├── database/
│   └── grocery_db.sql
├── middleware/
├── models/
├── routes/
├── utils/
├── .env.example
├── start.bat
├── reset-db.bat
├── package.json
└── server.js
```

**Important:** The `node_modules` folder should NOT be present in the extracted project. It will be created automatically when you run `start.bat`.

---

## Configuration

### Step 1: Create Environment File

1. Locate the `.env.example` file in the project root directory.

2. Copy `.env.example` and rename it to `.env`:
   - Right-click on `.env.example`
   - Select "Copy"
   - Right-click in the same directory and select "Paste"
   - Rename the copied file from `.env.example - Copy` to `.env`

   **Alternative (Command Prompt):**
   ```bash
   cd path\to\grocery-management-system
   copy .env.example .env
   ```

### Step 2: Edit Environment Variables

1. Open the `.env` file with a text editor (Notepad, VS Code, etc.).

2. Update the following values:

   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password_here
   DB_NAME=grocery_db

   # Server Configuration
   PORT=3000

   # JWT Secret Key
   JWT_SECRET=supersecretkey

   # Node Environment
   NODE_ENV=development
   ```

3. **Important:** Replace `your_mysql_password_here` with your actual MySQL root password. If your MySQL root user has no password, leave it empty:
   ```env
   DB_PASSWORD=
   ```

4. Save the file.

---

## Database Setup

You have two options for setting up the database. Choose the method that is most convenient for you.

### Option A: Using reset-db.bat Script (Recommended - Easiest)

This method automatically drops and recreates the database, making it ideal for fresh installations or resets.

1. **Ensure MySQL is Running:**
   - If using standalone MySQL: Check that MySQL service is running in Windows Services.
   - If using XAMPP: Start MySQL from XAMPP Control Panel.

2. **Run the Reset Script:**
   - Double-click `reset-db.bat` in the project root directory.
   - Or open Command Prompt, navigate to the project directory, and run:
     ```bash
     reset-db.bat
     ```

3. **Enter MySQL Password:**
   - When prompted, enter your MySQL root password.
   - If your MySQL root user has no password, simply press Enter.

4. **Wait for Completion:**
   - The script will:
     - Detect your MySQL installation
     - Drop the existing `grocery_db` database (if it exists)
     - Import the database from `database/grocery_db.sql`
   - You should see: "Database reset completed successfully!"

5. **Verify Default Credentials:**
   - The script will display the default login credentials at the end.

### Option B: Using MySQL Workbench

This method provides a visual interface for database management.

1. **Open MySQL Workbench:**
   - Launch MySQL Workbench from the Start menu.

2. **Connect to MySQL Server:**
   - Click on your MySQL connection (usually named "Local instance MySQL" or similar).
   - Enter your root password if prompted.
   - Click "OK" to connect.

3. **Import SQL File:**
   - Click **File** → **Run SQL Script...**
   - Navigate to your project directory: `grocery-management-system/database/`
   - Select `grocery_db.sql`
   - Click "Open"

4. **Execute the Script:**
   - The SQL script will appear in the query editor.
   - Click the **Execute** button (lightning bolt icon) or press `Ctrl+Shift+Enter`.
   - Wait for the script to complete. You should see "Script executed successfully" in the output panel.

5. **Verify Database Creation:**
   - In the left sidebar (Schema panel), refresh the view (right-click → Refresh All).
   - You should see `grocery_db` database with the following tables:
     - `users`
     - `products`
     - `stock`
     - `orders`
     - `order_items`
     - `cart`
     - `stock_movements`

### Option C: Using MySQL Command Line

If you prefer using the command line:

1. **Open Command Prompt** (Run as Administrator if needed).

2. **Navigate to Project Directory:**
   ```bash
   cd path\to\grocery-management-system
   ```

3. **Import Database:**
   ```bash
   mysql -u root -p < database\grocery_db.sql
   ```
   - Enter your MySQL root password when prompted.
   - If no password, use: `mysql -u root < database\grocery_db.sql`

4. **Verify Import:**
   ```bash
   mysql -u root -p
   ```
   ```sql
   SHOW DATABASES;
   USE grocery_db;
   SHOW TABLES;
   SELECT COUNT(*) FROM products;
   ```
   - You should see the `grocery_db` database and 10 products.

---

## Execution

### Starting the Backend Server

1. **Double-Click Method (Easiest):**
   - Navigate to the project root directory.
   - Double-click `start.bat`.
   - A console window will open and the server will start automatically.

2. **Command Prompt Method:**
   - Open Command Prompt.
   - Navigate to the project directory:
     ```bash
     cd path\to\grocery-management-system
     ```
   - Run:
     ```bash
     start.bat
     ```

### What Happens When You Run start.bat

The script will automatically:

1. **Check for Node.js:**
   - Verifies that Node.js is installed and accessible.

2. **Install Dependencies:**
   - Runs `npm install` to install all required packages.
   - This may take a few minutes on first run.
   - Creates the `node_modules` folder.

3. **Start the Server:**
   - Runs `npm start` to launch the backend server.
   - The server will connect to MySQL and start listening for requests.

### Expected Output

When the server starts successfully, you should see:

```
========================================
Starting Grocery Management Backend...
========================================

[INFO] Node.js found. Checking dependencies...

[INFO] Installing/updating dependencies...
... (npm install output) ...

[INFO] Dependencies installed successfully.

========================================
Starting server...
========================================

✅ Connected to MySQL successfully!
✅ Default admin created: admin@grocery.com
🚀 Server running on port 3000
```

**Important:** Keep this console window open. Closing it will stop the server.

### Server Endpoints

Once the server is running, the following endpoints are available:

- **Base URL:** `http://localhost:3000`
- **Products API:** `http://localhost:3000/api/products`
- **Users API:** `http://localhost:3000/api/users`
- **Orders API:** `http://localhost:3000/api/orders`
- **Stock API:** `http://localhost:3000/api/stock`
- **Reports API:** `http://localhost:3000/api/reports`

---

## Default Login Credentials

The database comes pre-populated with default user accounts for immediate testing and access.

### Admin Account

- **Email:** `admin@grocery.com`
- **Password:** `admin123`
- **Role:** Admin
- **Permissions:** Full access to all features (Products, Stock, Users, Orders, Reports)

### Staff Account

- **Email:** `staff@grocery.com`
- **Password:** `staff123`
- **Role:** Staff
- **Permissions:** Read/Write on Stock and Orders, Read on Products

### Customer Account

- **Note:** Customer accounts are created through the registration endpoint.
- **Default Role:** Customer (assigned automatically on registration)
- **Permissions:** Read on Products, Write on Orders (Checkout), Read own Order History

### Using the Credentials

1. **Login via API:**
   ```bash
   POST http://localhost:3000/api/users/login
   Content-Type: application/json
   
   {
     "email": "admin@grocery.com",
     "password": "admin123"
   }
   ```

2. **Response:**
   ```json
   {
     "success": true,
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "user": {
       "id": 1,
       "name": "Admin",
       "email": "admin@grocery.com",
       "role": "admin"
     }
   }
   ```

3. **Use the Token:**
   - Include the token in the `Authorization` header for protected endpoints:
     ```
     Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     ```

**Security Note:** Change these default passwords in a production environment!

---

## Verification

### Step 1: Verify Server is Running

1. Open a web browser or API testing tool (Postman, Insomnia, etc.).

2. Navigate to or send a GET request to:
   ```
   http://localhost:3000/api/products
   ```

3. **Expected Response:**
   ```json
   [
     {
       "id": 1,
       "name": "Fresh Milk",
       "category": "Dairy",
       "price": 3.99,
       ...
     },
     ...
   ]
   ```
   - You should receive a JSON array with 10 products.

### Step 2: Verify Authentication

1. **Test Login:**
   ```bash
   POST http://localhost:3000/api/users/login
   Content-Type: application/json
   
   {
     "email": "admin@grocery.com",
     "password": "admin123"
   }
   ```

2. **Expected Response:**
   - Status: `200 OK`
   - Body contains `token` and `user` object.

### Step 3: Verify Database Connection

Check the console window where the server is running. You should see:
- `✅ Connected to MySQL successfully!`
- No MySQL connection errors.

---

## Troubleshooting

### Problem: "Node.js is not installed or not in PATH"

**Solution:**
1. Install Node.js from [https://nodejs.org/](https://nodejs.org/)
2. Restart your computer after installation.
3. Verify installation: `node --version` in Command Prompt.

### Problem: "MySQL connection failed"

**Possible Causes and Solutions:**

1. **MySQL is not running:**
   - Start MySQL service from Windows Services.
   - Or start MySQL from XAMPP Control Panel.

2. **Incorrect password in .env file:**
   - Verify `DB_PASSWORD` in `.env` matches your MySQL root password.
   - If MySQL has no password, ensure `DB_PASSWORD=` is empty (no spaces).

3. **MySQL not accessible:**
   - Verify MySQL is listening on `localhost:3306`.
   - Check Windows Firewall settings.

### Problem: "Database file not found: database\grocery_db.sql"

**Solution:**
- Ensure you are running `reset-db.bat` from the project root directory.
- Verify `database/grocery_db.sql` exists in the project.

### Problem: "MySQL executable not found" (reset-db.bat)

**Solution:**
1. Add MySQL to your system PATH, OR
2. Edit `reset-db.bat` and update the MySQL path to match your installation:
   ```batch
   set "MYSQL_PATH=C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
   ```

### Problem: "Failed to install dependencies" (npm install errors)

**Solutions:**
1. Check internet connection (required for first-time installation).
2. Clear npm cache: `npm cache clean --force`
3. Delete `node_modules` folder and `package-lock.json`, then run `start.bat` again.
4. Try running `npm install` manually in Command Prompt to see detailed error messages.

### Problem: "Port 3000 is already in use"

**Solution:**
1. Change `PORT` in `.env` file to an available port (e.g., `3001`, `5000`).
2. Or stop the application using port 3000:
   ```bash
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

### Problem: "Cannot access API endpoints"

**Solutions:**
1. Verify server is running (check console window).
2. Verify server is listening on the correct port (check console output).
3. Use the correct URL: `http://localhost:3000/api/products` (not `https://`)
4. Check Windows Firewall is not blocking Node.js.

### Problem: "Token expired" or "Unauthorized"

**Solutions:**
1. Tokens expire after 60 minutes. Login again to get a new token.
2. Ensure you include the token in the `Authorization` header:
   ```
   Authorization: Bearer <your-token-here>
   ```
3. Verify the token is not corrupted (copy the entire token string).

---

## Additional Resources

### API Documentation

For detailed API documentation, refer to:
- Postman Collection (if provided)
- API endpoint documentation in the project repository

### Support

If you encounter issues not covered in this guide:

1. Check the console output for detailed error messages.
2. Verify all prerequisites are installed correctly.
3. Ensure all configuration files are set up properly.
4. Review the troubleshooting section above.

### Resetting the Database

To reset the database to its initial state:

1. Run `reset-db.bat` again.
2. This will drop and recreate the database with fresh seed data.

---

## Quick Start Checklist

Use this checklist to ensure you've completed all setup steps:

- [ ] Node.js installed and verified (`node --version`)
- [ ] MySQL installed and running
- [ ] Project extracted/cloned to local directory
- [ ] `.env` file created from `.env.example`
- [ ] `DB_PASSWORD` updated in `.env` file
- [ ] Database imported (using `reset-db.bat`, MySQL Workbench, or command line)
- [ ] `start.bat` executed successfully
- [ ] Server running on port 3000
- [ ] API endpoint tested (`http://localhost:3000/api/products`)
- [ ] Login tested with admin credentials

---

**Congratulations!** You have successfully installed and configured the Grocery Management System backend. You can now start using the API endpoints and building your frontend application.

---

*Last Updated: December 2024*

