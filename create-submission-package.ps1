# Grocery Management System - Submission Package Creator
# This script creates the final ZIP archive for submission

Write-Host "========================================"
Write-Host "Grocery Management System"
Write-Host "Submission Package Creator"
Write-Host "========================================"
Write-Host ""

# Check if required files exist
$requiredFiles = @(
    '.env.example',
    'start.bat',
    'reset-db.bat',
    'OFFLINE-INSTALLATION-GUIDE-WINDOWS.md',
    'README.md',
    'database\grocery_db.sql',
    'package.json',
    'server.js'
)

Write-Host "Checking required files..."
$missing = @()
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file - MISSING" -ForegroundColor Red
        $missing += $file
    }
}

if ($missing.Count -gt 0) {
    Write-Host ""
    Write-Host "ERROR: Missing required files. Please ensure all files are present." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "All required files found!" -ForegroundColor Green
Write-Host ""

# Create temporary directory for packaging
$tempDir = "grocery-management-system-submission"
$zipName = "grocery-management-system-backend.zip"

# Remove existing temp directory and zip if they exist
if (Test-Path $tempDir) {
    Write-Host "Removing existing temporary directory..." -ForegroundColor Yellow
    Remove-Item -Path $tempDir -Recurse -Force
}

if (Test-Path $zipName) {
    Write-Host "Removing existing ZIP file..." -ForegroundColor Yellow
    Remove-Item -Path $zipName -Force
}

Write-Host "Creating submission package..." -ForegroundColor Cyan
Write-Host ""

# Create temp directory
New-Item -ItemType Directory -Path $tempDir | Out-Null

# Copy required directories (excluding node_modules)
Write-Host "Copying project files..."

# Copy directories
$directories = @('config', 'controllers', 'database', 'middleware', 'models', 'routes', 'utils')
foreach ($dir in $directories) {
    if (Test-Path $dir) {
        Copy-Item -Path $dir -Destination $tempDir -Recurse -Force
        Write-Host "  ✅ Copied $dir/" -ForegroundColor Green
    }
}

# Copy required files
$filesToCopy = @(
    '.env.example',
    'start.bat',
    'reset-db.bat',
    'OFFLINE-INSTALLATION-GUIDE-WINDOWS.md',
    'README.md',
    'package.json',
    'server.js'
)

foreach ($file in $filesToCopy) {
    if (Test-Path $file) {
        Copy-Item -Path $file -Destination $tempDir -Force
        Write-Host "  ✅ Copied $file" -ForegroundColor Green
    }
}

# Create uploads directory (empty, for image uploads)
if (-not (Test-Path "$tempDir\uploads")) {
    New-Item -ItemType Directory -Path "$tempDir\uploads" | Out-Null
    Write-Host "  ✅ Created uploads/ directory" -ForegroundColor Green
}

Write-Host ""
Write-Host "Creating ZIP archive..." -ForegroundColor Cyan

# Create ZIP file
Compress-Archive -Path $tempDir\* -DestinationPath $zipName -Force

# Get ZIP file size
$zipSize = (Get-Item $zipName).Length
$zipSizeMB = [math]::Round($zipSize / 1MB, 2)

Write-Host ""
Write-Host "========================================"
Write-Host "Package Created Successfully!" -ForegroundColor Green
Write-Host "========================================"
Write-Host "File: $zipName"
Write-Host "Size: $zipSizeMB MB ($zipSize bytes)"
Write-Host ""
Write-Host "Package Contents:" -ForegroundColor Cyan
Get-ChildItem -Path $tempDir -Recurse | Select-Object FullName | ForEach-Object {
    $relativePath = $_.FullName.Replace((Get-Item $tempDir).FullName + "\", "")
    Write-Host "  - $relativePath"
}

Write-Host ""
Write-Host "Cleaning up temporary directory..." -ForegroundColor Yellow
Remove-Item -Path $tempDir -Recurse -Force

Write-Host ""
Write-Host "✅ Submission package ready: $zipName" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:"
Write-Host "  1. Extract the ZIP file to verify structure"
Write-Host "  2. Test that start.bat works from extracted folder"
Write-Host "  3. Submit the ZIP file"
Write-Host ""

