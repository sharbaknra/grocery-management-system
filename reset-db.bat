@echo off
echo ========================================
echo Grocery Management System - Database Reset
echo ========================================
echo.

REM Check if SQL file exists
if not exist "database\grocery_db.sql" (
    echo [ERROR] Database file not found: database\grocery_db.sql
    echo Please ensure you are running this script from the project root directory.
    pause
    exit /b 1
)

echo [INFO] Database file found: database\grocery_db.sql
echo.

REM Try to find MySQL executable in common locations
set MYSQL_PATH=

REM Check if mysql is in PATH first
where mysql >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    set MYSQL_PATH=mysql
    echo [INFO] MySQL found in PATH.
    goto :found_mysql
)

REM Try common installation paths
if exist "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" (
    set "MYSQL_PATH=C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
    echo [INFO] MySQL found at: C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe
    goto :found_mysql
)

if exist "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe" (
    set "MYSQL_PATH=C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe"
    echo [INFO] MySQL found at: C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe
    goto :found_mysql
)

if exist "C:\Program Files\MySQL\MySQL Server 5.7\bin\mysql.exe" (
    set "MYSQL_PATH=C:\Program Files\MySQL\MySQL Server 5.7\bin\mysql.exe"
    echo [INFO] MySQL found at: C:\Program Files\MySQL\MySQL Server 5.7\bin\mysql.exe
    goto :found_mysql
)

if exist "C:\xampp\mysql\bin\mysql.exe" (
    set "MYSQL_PATH=C:\xampp\mysql\bin\mysql.exe"
    echo [INFO] MySQL found at: C:\xampp\mysql\bin\mysql.exe
    goto :found_mysql
)

if exist "C:\wamp64\bin\mysql\mysql8.0.27\bin\mysql.exe" (
    set "MYSQL_PATH=C:\wamp64\bin\mysql\mysql8.0.27\bin\mysql.exe"
    echo [INFO] MySQL found at: C:\wamp64\bin\mysql\mysql8.0.27\bin\mysql.exe
    goto :found_mysql
)

echo [ERROR] MySQL executable not found.
echo.
echo Please ensure MySQL is installed and either:
echo   1. MySQL is in your system PATH, OR
echo   2. Update this script with the correct MySQL path
echo.
echo Common MySQL installation paths:
echo   - C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe
echo   - C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe
echo   - C:\xampp\mysql\bin\mysql.exe
echo   - C:\wamp64\bin\mysql\mysql8.0.27\bin\mysql.exe
pause
exit /b 1

:found_mysql
echo.

REM Prompt for MySQL root password
set /p MYSQL_PASSWORD="Enter MySQL root password (press Enter if no password): "

echo.
echo [INFO] Dropping existing database (if exists)...
echo.

REM Drop database if exists (ignore errors if database doesn't exist)
if "%MYSQL_PASSWORD%"=="" (
    echo DROP DATABASE IF EXISTS grocery_db; | "%MYSQL_PATH%" -u root 2>nul
) else (
    echo DROP DATABASE IF EXISTS grocery_db; | "%MYSQL_PATH%" -u root -p%MYSQL_PASSWORD% 2>nul
)

echo [INFO] Importing database from grocery_db.sql...
echo.

REM Import database
if "%MYSQL_PASSWORD%"=="" (
    "%MYSQL_PATH%" -u root < "database\grocery_db.sql"
) else (
    "%MYSQL_PATH%" -u root -p%MYSQL_PASSWORD% < "database\grocery_db.sql"
)

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Failed to import database.
    echo Please check:
    echo   1. MySQL is running
    echo   2. Root password is correct
    echo   3. You have permission to create databases
    pause
    exit /b 1
)

echo.
echo ========================================
echo Database reset completed successfully!
echo ========================================
echo.
echo Default credentials:
echo   Admin: admin@grocery.com / admin123
echo   Staff: staff@grocery.com / staff123
echo.
pause

