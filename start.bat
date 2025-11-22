@echo off
echo ========================================
echo Starting Grocery Management Backend...
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [INFO] Node.js found. Checking dependencies...
echo.

REM Install dependencies
echo [INFO] Installing/updating dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install dependencies.
    pause
    exit /b 1
)

echo.
echo [INFO] Dependencies installed successfully.
echo.
echo ========================================
echo Starting server...
echo ========================================
echo.

REM Start the server
call npm start

REM Keep window open if server exits
pause

