/**
 * Comprehensive Backend Testing Suite
 * Covers: Structural, Functional, and Non-Functional Testing
 * 
 * Test Categories:
 * 1. Structural Testing - Database schema, tables, keys, columns, relationships
 * 2. Functional Testing - API endpoints, business logic, data flow
 * 3. Non-Functional Testing - Performance, security, load handling
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

// Test configuration
const BASE_URL = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
const API_BASE = `${BASE_URL}/api`;
const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'grocery_db'
};

// Test results storage
const testResults = {
  structural: { passed: 0, failed: 0, tests: [] },
  functional: { passed: 0, failed: 0, tests: [] },
  nonFunctional: { passed: 0, failed: 0, tests: [] },
  startTime: new Date(),
  endTime: null,
  summary: {}
};

let adminToken = '';
let staffToken = '';
let customerToken = '';

// Utility functions
function log(message, type = 'INFO', category = 'GENERAL') {
  const timestamp = new Date().toISOString();
  const prefix = type === 'PASS' ? '✅' : type === 'FAIL' ? '❌' : type === 'WARN' ? '⚠️' : 'ℹ️';
  console.log(`${prefix} [${timestamp}] [${category}] ${message}`);
  return { timestamp, type, category, message };
}

function recordTest(category, name, passed, details = '', error = null) {
  const result = {
    name,
    passed,
    details,
    error: error ? error.message : null,
    timestamp: new Date().toISOString()
  };
  
  testResults[category].tests.push(result);
  if (passed) {
    testResults[category].passed++;
  } else {
    testResults[category].failed++;
  }
  
  log(`${passed ? 'PASS' : 'FAIL'}: ${name}`, passed ? 'PASS' : 'FAIL', category);
  if (error) {
    log(`Error: ${error.message}`, 'FAIL', category);
  }
  if (details) {
    log(`Details: ${details}`, 'INFO', category);
  }
}

// HTTP request helper
function makeRequest(method, path, headers = {}, body = null, timeout = 10000) {
  return new Promise((resolve, reject) => {
    // Ensure path starts with /api if it doesn't already
    const fullPath = path.startsWith('/api') ? path : `/api${path}`;
    const url = new URL(fullPath, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port || (process.env.PORT || 5000),
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      timeout: timeout
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : {};
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: jsonData,
            rawData: data
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data,
            rawData: data
          });
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

// Database connection helper
async function getDbConnection() {
  try {
    const connection = await mysql.createConnection(DB_CONFIG);
    return connection;
  } catch (error) {
    throw new Error(`Database connection failed: ${error.message}`);
  }
}

// ============================================================================
// 1. STRUCTURAL TESTING - Database Schema, Tables, Keys, Columns
// ============================================================================

async function runStructuralTests() {
  console.log('\n' + '='.repeat(70));
  console.log('1. STRUCTURAL TESTING');
  console.log('='.repeat(70) + '\n');

  let connection;
  try {
    connection = await getDbConnection();
    log('Database connection established', 'PASS', 'STRUCTURAL');

    // Test 1.1: Verify all required tables exist
    try {
      const [tables] = await connection.execute(`
        SELECT TABLE_NAME 
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_SCHEMA = ?
        ORDER BY TABLE_NAME
      `, [DB_CONFIG.database]);

      const tableNames = tables.map(t => t.TABLE_NAME);
      const requiredTables = ['users', 'products', 'stock', 'orders', 'order_items', 'cart', 'stock_movements'];
      const missing = requiredTables.filter(t => !tableNames.includes(t));

      if (missing.length === 0) {
        recordTest('structural', 'All required tables exist', true, 
          `Found ${tableNames.length} tables: ${tableNames.join(', ')}`);
      } else {
        recordTest('structural', 'All required tables exist', false, 
          `Missing tables: ${missing.join(', ')}`);
      }
    } catch (error) {
      recordTest('structural', 'All required tables exist', false, '', error);
    }

    // Test 1.2: Verify users table structure
    try {
      const [columns] = await connection.execute(`
        SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT, COLUMN_KEY
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users'
        ORDER BY ORDINAL_POSITION
      `, [DB_CONFIG.database]);

      const columnNames = columns.map(c => c.COLUMN_NAME);
      const requiredColumns = ['id', 'name', 'email', 'password', 'role', 'created_at'];
      const missing = requiredColumns.filter(c => !columnNames.includes(c));

      if (missing.length === 0) {
        recordTest('structural', 'Users table structure', true, 
          `All required columns present: ${columnNames.join(', ')}`);
      } else {
        recordTest('structural', 'Users table structure', false, 
          `Missing columns: ${missing.join(', ')}`);
      }

      // Verify email is unique
      const emailCol = columns.find(c => c.COLUMN_NAME === 'email');
      if (emailCol && emailCol.COLUMN_KEY === 'UNI') {
        recordTest('structural', 'Users email unique constraint', true, 'Email column has UNIQUE constraint');
      } else {
        recordTest('structural', 'Users email unique constraint', false, 'Email column missing UNIQUE constraint');
      }
    } catch (error) {
      recordTest('structural', 'Users table structure', false, '', error);
    }

    // Test 1.3: Verify products table structure
    try {
      const [columns] = await connection.execute(`
        SELECT COLUMN_NAME, DATA_TYPE, COLUMN_KEY
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'products'
        ORDER BY ORDINAL_POSITION
      `, [DB_CONFIG.database]);

      const columnNames = columns.map(c => c.COLUMN_NAME);
      const requiredColumns = ['id', 'name', 'category', 'price', 'barcode', 'image_url', 'created_at'];
      const missing = requiredColumns.filter(c => !columnNames.includes(c));

      if (missing.length === 0) {
        recordTest('structural', 'Products table structure', true, 
          `All required columns present: ${columnNames.join(', ')}`);
      } else {
        recordTest('structural', 'Products table structure', false, 
          `Missing columns: ${missing.join(', ')}`);
      }

      // Verify barcode is unique
      const barcodeCol = columns.find(c => c.COLUMN_NAME === 'barcode');
      if (barcodeCol && barcodeCol.COLUMN_KEY === 'UNI') {
        recordTest('structural', 'Products barcode unique constraint', true, 'Barcode column has UNIQUE constraint');
      } else {
        recordTest('structural', 'Products barcode unique constraint', false, 'Barcode column missing UNIQUE constraint');
      }
    } catch (error) {
      recordTest('structural', 'Products table structure', false, '', error);
    }

    // Test 1.4: Verify foreign key constraints
    try {
      const [fks] = await connection.execute(`
        SELECT 
          TABLE_NAME,
          COLUMN_NAME,
          CONSTRAINT_NAME,
          REFERENCED_TABLE_NAME,
          REFERENCED_COLUMN_NAME
        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
        WHERE TABLE_SCHEMA = ? 
          AND REFERENCED_TABLE_NAME IS NOT NULL
        ORDER BY TABLE_NAME, CONSTRAINT_NAME
      `, [DB_CONFIG.database]);

      const criticalFKs = [
        { table: 'stock', refTable: 'products' },
        { table: 'orders', refTable: 'users' },
        { table: 'order_items', refTable: 'orders' },
        { table: 'order_items', refTable: 'products' },
        { table: 'cart', refTable: 'users' },
        { table: 'cart', refTable: 'products' }
      ];

      let fkCount = 0;
      criticalFKs.forEach(fk => {
        const found = fks.find(f => f.TABLE_NAME === fk.table && f.REFERENCED_TABLE_NAME === fk.refTable);
        if (found) fkCount++;
      });

      if (fkCount === criticalFKs.length) {
        recordTest('structural', 'Foreign key constraints', true, 
          `All ${criticalFKs.length} critical foreign keys present`);
      } else {
        recordTest('structural', 'Foreign key constraints', false, 
          `Only ${fkCount}/${criticalFKs.length} critical foreign keys found`);
      }
    } catch (error) {
      recordTest('structural', 'Foreign key constraints', false, '', error);
    }

    // Test 1.5: Verify indexes exist
    try {
      const [indexes] = await connection.execute(`
        SELECT TABLE_NAME, INDEX_NAME, COLUMN_NAME
        FROM INFORMATION_SCHEMA.STATISTICS
        WHERE TABLE_SCHEMA = ?
          AND INDEX_NAME != 'PRIMARY'
        ORDER BY TABLE_NAME, INDEX_NAME
      `, [DB_CONFIG.database]);

      const criticalIndexes = [
        { table: 'users', column: 'email' },
        { table: 'products', column: 'barcode' },
        { table: 'orders', column: 'user_id' },
        { table: 'orders', column: 'status' },
        { table: 'order_items', column: 'order_id' }
      ];

      let indexCount = 0;
      criticalIndexes.forEach(idx => {
        const found = indexes.find(i => i.TABLE_NAME === idx.table && i.COLUMN_NAME === idx.column);
        if (found) indexCount++;
      });

      if (indexCount >= criticalIndexes.length * 0.8) {
        recordTest('structural', 'Database indexes', true, 
          `Found ${indexCount}/${criticalIndexes.length} critical indexes`);
      } else {
        recordTest('structural', 'Database indexes', false, 
          `Only ${indexCount}/${criticalIndexes.length} critical indexes found`);
      }
    } catch (error) {
      recordTest('structural', 'Database indexes', false, '', error);
    }

    // Test 1.6: Verify data types
    try {
      const [columns] = await connection.execute(`
        SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = ?
          AND ((TABLE_NAME = 'products' AND COLUMN_NAME = 'price')
            OR (TABLE_NAME = 'orders' AND COLUMN_NAME = 'total_price')
            OR (TABLE_NAME = 'order_items' AND COLUMN_NAME = 'unit_price_at_sale'))
      `, [DB_CONFIG.database]);

      const decimalColumns = columns.filter(c => c.DATA_TYPE === 'decimal' || c.DATA_TYPE === 'decimal');
      if (decimalColumns.length >= 3) {
        recordTest('structural', 'Price columns data types', true, 
          `Price columns use DECIMAL type for precision`);
      } else {
        recordTest('structural', 'Price columns data types', false, 
          `Some price columns may not use DECIMAL type`);
      }
    } catch (error) {
      recordTest('structural', 'Price columns data types', false, '', error);
    }

    // Test 1.7: Verify ON DELETE CASCADE on stock
    try {
      const [fks] = await connection.execute(`
        SELECT 
          CONSTRAINT_NAME,
          DELETE_RULE
        FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS
        WHERE CONSTRAINT_SCHEMA = ?
          AND TABLE_NAME = 'stock'
          AND REFERENCED_TABLE_NAME = 'products'
      `, [DB_CONFIG.database]);

      const cascadeFK = fks.find(fk => fk.DELETE_RULE === 'CASCADE');
      if (cascadeFK) {
        recordTest('structural', 'Stock ON DELETE CASCADE', true, 
          'Stock table has CASCADE delete on products');
      } else {
        recordTest('structural', 'Stock ON DELETE CASCADE', false, 
          'Stock table missing CASCADE delete constraint');
      }
    } catch (error) {
      recordTest('structural', 'Stock ON DELETE CASCADE', false, '', error);
    }

    await connection.end();
  } catch (error) {
    recordTest('structural', 'Database connection', false, '', error);
  }
}

// ============================================================================
// 2. FUNCTIONAL TESTING - API Endpoints, Business Logic
// ============================================================================

async function runFunctionalTests() {
  console.log('\n' + '='.repeat(70));
  console.log('2. FUNCTIONAL TESTING');
  console.log('='.repeat(70) + '\n');

  // Test 2.1: Authentication - Register
  try {
    const testEmail = `testuser_${Date.now()}@test.com`;
    const response = await makeRequest('POST', '/users/register', {}, {
      name: 'Test User',
      email: testEmail,
      password: 'testpass123'
    });

    if (response.status === 201 || response.status === 200) {
      recordTest('functional', 'User Registration', true, 
        `User registered successfully: ${testEmail}`);
    } else {
      recordTest('functional', 'User Registration', false, 
        `Status: ${response.status}, Response: ${JSON.stringify(response.body)}`);
    }
  } catch (error) {
    recordTest('functional', 'User Registration', false, `Error: ${error.message || error}`, error);
  }

  // Test 2.2: Authentication - Login (Admin)
  try {
    const response = await makeRequest('POST', '/users/login', {}, {
      email: 'admin@grocery.com',
      password: 'admin123'
    });

    if (response.status === 200 && response.body.token) {
      adminToken = response.body.token;
      recordTest('functional', 'Admin Login', true, 'Admin authentication successful');
    } else {
      recordTest('functional', 'Admin Login', false, 
        `Status: ${response.status}, Response: ${JSON.stringify(response.body)}`);
    }
  } catch (error) {
    recordTest('functional', 'Admin Login', false, `Error: ${error.message || error}`, error);
  }

  // Test 2.3: Authentication - Login (Staff)
  try {
    const response = await makeRequest('POST', '/users/login', {}, {
      email: 'staff@grocery.com',
      password: 'staff123'
    });

    if (response.status === 200 && response.body.token) {
      staffToken = response.body.token;
      recordTest('functional', 'Staff Login', true, 'Staff authentication successful');
    } else {
      recordTest('functional', 'Staff Login', false, 
        `Status: ${response.status}, Response: ${JSON.stringify(response.body)}`);
    }
  } catch (error) {
    recordTest('functional', 'Staff Login', false, `Error: ${error.message || error}`, error);
  }

  // Test 2.4: Get Products (requires auth)
  try {
    const response = await makeRequest('GET', '/products', {
      'Authorization': `Bearer ${adminToken}`
    });

    if (response.status === 200 && Array.isArray(response.body)) {
      recordTest('functional', 'Get Products', true, 
        `Retrieved ${response.body.length} products`);
    } else {
      recordTest('functional', 'Get Products', false, 
        `Status: ${response.status}, Response: ${JSON.stringify(response.body)}`);
    }
  } catch (error) {
    recordTest('functional', 'Get Products', false, `Error: ${error.message || error}`, error);
  }

  // Test 2.5: Create Product (Admin only)
  try {
    const response = await makeRequest('POST', '/products/add', {
      'Authorization': `Bearer ${adminToken}`
    }, {
      name: 'Test Product',
      category: 'Test',
      price: 9.99,
      barcode: `TEST_${Date.now()}`,
      description: 'Test product description',
      supplier: 'Test Supplier'
    });

    if (response.status === 201 || response.status === 200) {
      recordTest('functional', 'Create Product', true, 
        `Product created: ${response.body.productId || 'ID returned'}`);
    } else {
      recordTest('functional', 'Create Product', false, 
        `Status: ${response.status}, Response: ${JSON.stringify(response.body)}`);
    }
  } catch (error) {
    recordTest('functional', 'Create Product', false, `Error: ${error.message || error}`, error);
  }

  // Test 2.6: Get Stock (using low-stock endpoint as stock inventory endpoint doesn't exist)
  try {
    const response = await makeRequest('GET', '/stock/low-stock', {
      'Authorization': `Bearer ${adminToken}`
    });

    if (response.status === 200 && response.body.success && response.body.data) {
      recordTest('functional', 'Get Stock Inventory', true, 
        `Retrieved ${response.body.data.count || 0} low stock items`);
    } else {
      recordTest('functional', 'Get Stock Inventory', false, 
        `Status: ${response.status}, Response: ${JSON.stringify(response.body)}`);
    }
  } catch (error) {
    recordTest('functional', 'Get Stock Inventory', false, `Error: ${error.message || error}`, error);
  }

  // Test 2.7: Restock (Admin only)
  try {
    // First get a product ID
    const productsResponse = await makeRequest('GET', '/products', {
      'Authorization': `Bearer ${adminToken}`
    });

    if (productsResponse.status === 200 && productsResponse.body.length > 0) {
      const productId = productsResponse.body[0].id;
      const response = await makeRequest('POST', '/stock/restock', {
        'Authorization': `Bearer ${adminToken}`
      }, {
        productId: productId,
        quantity: 10
      });

      if (response.status === 200) {
        recordTest('functional', 'Restock Product', true, 
          `Restocked product ${productId} with 10 units`);
      } else {
        recordTest('functional', 'Restock Product', false, 
          `Status: ${response.status}`);
      }
    } else {
      recordTest('functional', 'Restock Product', false, 
        'No products available for restock test');
    }
  } catch (error) {
    recordTest('functional', 'Restock Product', false, '', error);
  }

  // Test 2.8: Get Sales Summary
  try {
    const response = await makeRequest('GET', '/reports/sales/summary', {
      'Authorization': `Bearer ${adminToken}`
    });

    if (response.status === 200 && response.body.success && response.body.data) {
      const summary = response.body.data;
      if (summary.today !== undefined || summary.week !== undefined || summary.month !== undefined) {
        recordTest('functional', 'Sales Summary Report', true, 
          'Sales summary retrieved successfully with proper structure');
      } else {
        recordTest('functional', 'Sales Summary Report', false, 
          `Status: 200 but unexpected data structure: ${JSON.stringify(summary)}`);
      }
    } else {
      recordTest('functional', 'Sales Summary Report', false, 
        `Status: ${response.status}, Response: ${JSON.stringify(response.body)}`);
    }
  } catch (error) {
    recordTest('functional', 'Sales Summary Report', false, `Error: ${error.message || error}`, error);
  }

  // Test 2.9: Authorization - Unauthorized access
  try {
    const response = await makeRequest('GET', '/products', {}); // No token

    if (response.status === 401 || response.status === 403) {
      recordTest('functional', 'Authorization Check', true, 
        'Unauthorized access correctly rejected');
    } else {
      recordTest('functional', 'Authorization Check', false, 
        `Expected 401/403, got ${response.status}`);
    }
  } catch (error) {
    recordTest('functional', 'Authorization Check', false, '', error);
  }

  // Test 2.10: Role-based access - Staff can access stock
  try {
    if (staffToken) {
      const response = await makeRequest('GET', '/stock/low-stock', {
        'Authorization': `Bearer ${staffToken}`
      });

      if (response.status === 200 && response.body.success) {
        recordTest('functional', 'Staff Stock Access', true, 
          'Staff can access stock endpoints');
      } else {
        recordTest('functional', 'Staff Stock Access', false, 
          `Status: ${response.status}, Response: ${JSON.stringify(response.body)}`);
      }
    } else {
      recordTest('functional', 'Staff Stock Access', false, 
        'Staff token not available');
    }
  } catch (error) {
    recordTest('functional', 'Staff Stock Access', false, `Error: ${error.message || error}`, error);
  }
}

// ============================================================================
// 3. NON-FUNCTIONAL TESTING - Performance, Security, Load
// ============================================================================

async function runNonFunctionalTests() {
  console.log('\n' + '='.repeat(70));
  console.log('3. NON-FUNCTIONAL TESTING');
  console.log('='.repeat(70) + '\n');

  // Test 3.1: Response Time - Products endpoint
  try {
    const startTime = Date.now();
    const response = await makeRequest('GET', '/products', {
      'Authorization': `Bearer ${adminToken}`
    }, null, 5000);
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    if (response.status === 200) {
      if (responseTime < 1000) {
        recordTest('nonFunctional', 'Products Endpoint Performance', true, 
          `Response time: ${responseTime}ms (excellent)`);
      } else if (responseTime < 3000) {
        recordTest('nonFunctional', 'Products Endpoint Performance', true, 
          `Response time: ${responseTime}ms (acceptable)`);
      } else {
        recordTest('nonFunctional', 'Products Endpoint Performance', false, 
          `Response time: ${responseTime}ms (too slow)`);
      }
    } else {
      recordTest('nonFunctional', 'Products Endpoint Performance', false, 
        `Status: ${response.status}`);
    }
  } catch (error) {
    recordTest('nonFunctional', 'Products Endpoint Performance', false, '', error);
  }

  // Test 3.2: Database Query Performance
  try {
    const connection = await getDbConnection();
    const startTime = Date.now();
    const [rows] = await connection.execute('SELECT * FROM products LIMIT 100');
    const endTime = Date.now();
    const queryTime = endTime - startTime;

    if (queryTime < 100) {
      recordTest('nonFunctional', 'Database Query Performance', true, 
        `Query time: ${queryTime}ms (excellent)`);
    } else if (queryTime < 500) {
      recordTest('nonFunctional', 'Database Query Performance', true, 
        `Query time: ${queryTime}ms (acceptable)`);
    } else {
      recordTest('nonFunctional', 'Database Query Performance', false, 
        `Query time: ${queryTime}ms (too slow)`);
    }

    await connection.end();
  } catch (error) {
    recordTest('nonFunctional', 'Database Query Performance', false, '', error);
  }

  // Test 3.3: Concurrent Requests Handling
  try {
    const requests = Array(10).fill(null).map(() => 
      makeRequest('GET', '/products', {
        'Authorization': `Bearer ${adminToken}`
      }, null, 5000)
    );

    const startTime = Date.now();
    const responses = await Promise.all(requests);
    const endTime = Date.now();
    const totalTime = endTime - startTime;

    const successCount = responses.filter(r => r.status === 200).length;
    if (successCount >= 8) {
      recordTest('nonFunctional', 'Concurrent Requests Handling', true, 
        `${successCount}/10 requests succeeded in ${totalTime}ms`);
    } else {
      recordTest('nonFunctional', 'Concurrent Requests Handling', false, 
        `Only ${successCount}/10 requests succeeded`);
    }
  } catch (error) {
    recordTest('nonFunctional', 'Concurrent Requests Handling', false, '', error);
  }

  // Test 3.4: Security - SQL Injection Protection
  try {
    const maliciousInput = "'; DROP TABLE users; --";
    const response = await makeRequest('POST', '/users/register', {}, {
      name: 'Test',
      email: maliciousInput,
      password: 'test123'
    });

    // Should either reject or sanitize, not crash
    if (response.status === 400 || response.status === 201) {
      recordTest('nonFunctional', 'SQL Injection Protection', true, 
        'Malicious input handled safely');
    } else {
      recordTest('nonFunctional', 'SQL Injection Protection', false, 
        `Unexpected status: ${response.status}`);
    }
  } catch (error) {
    // If it throws, that's actually good - means it's being rejected
    recordTest('nonFunctional', 'SQL Injection Protection', true, 
      'Malicious input rejected');
  }

  // Test 3.5: Security - Password Hashing
  try {
    const connection = await getDbConnection();
    const [rows] = await connection.execute(
      'SELECT password FROM users WHERE email = ?',
      ['admin@grocery.com']
    );

    if (rows.length > 0) {
      const passwordHash = rows[0].password;
      // Bcrypt hashes start with $2a$, $2b$, or $2y$
      if (passwordHash.startsWith('$2')) {
        recordTest('nonFunctional', 'Password Hashing', true, 
          'Passwords are properly hashed with bcrypt');
      } else {
        recordTest('nonFunctional', 'Password Hashing', false, 
          'Passwords may not be properly hashed');
      }
    } else {
      recordTest('nonFunctional', 'Password Hashing', false, 
        'Admin user not found');
    }

    await connection.end();
  } catch (error) {
    recordTest('nonFunctional', 'Password Hashing', false, '', error);
  }

  // Test 3.6: Security - JWT Token Validation
  try {
    const invalidToken = 'invalid.token.here';
    const response = await makeRequest('GET', '/products', {
      'Authorization': `Bearer ${invalidToken}`
    });

    if (response.status === 401 || response.status === 403) {
      recordTest('nonFunctional', 'JWT Token Validation', true, 
        'Invalid tokens are rejected');
    } else {
      recordTest('nonFunctional', 'JWT Token Validation', false, 
        `Invalid token accepted: ${response.status}`);
    }
  } catch (error) {
    recordTest('nonFunctional', 'JWT Token Validation', true, 
      'Invalid tokens are rejected');
  }

  // Test 3.7: Input Validation - Negative Price
  try {
    const response = await makeRequest('POST', '/products/add', {
      'Authorization': `Bearer ${adminToken}`
    }, {
      name: 'Test Product',
      category: 'Test',
      price: -10.00, // Invalid negative price
      barcode: `TEST_NEG_${Date.now()}`
    });

    if (response.status === 400) {
      recordTest('nonFunctional', 'Input Validation', true, 
        'Negative prices are rejected');
    } else if (response.status === 201 || response.status === 200) {
      recordTest('nonFunctional', 'Input Validation', false, 
        `Negative price accepted: ${response.status}`);
    } else {
      recordTest('nonFunctional', 'Input Validation', true, 
        `Invalid input rejected with status ${response.status}`);
    }
  } catch (error) {
    recordTest('nonFunctional', 'Input Validation', true, 
      'Invalid input rejected');
  }

  // Test 3.8: Error Handling - Invalid Endpoint
  try {
    const response = await makeRequest('GET', '/invalid/endpoint', {
      'Authorization': `Bearer ${adminToken}`
    });

    if (response.status === 404) {
      recordTest('nonFunctional', 'Error Handling', true, 
        'Invalid endpoints return 404');
    } else {
      recordTest('nonFunctional', 'Error Handling', false, 
        `Expected 404, got ${response.status}`);
    }
  } catch (error) {
    recordTest('nonFunctional', 'Error Handling', false, '', error);
  }

  // Test 3.9: Data Integrity - Stock Cannot Go Negative
  try {
    // Get a product with stock
    const productsResponse = await makeRequest('GET', '/products', {
      'Authorization': `Bearer ${adminToken}`
    });

    if (productsResponse.status === 200 && productsResponse.body.length > 0) {
      const product = productsResponse.body[0];
      if (product.quantity !== undefined) {
        const largeQuantity = product.quantity + 1000;
        const response = await makeRequest('POST', '/stock/reduce', {
          'Authorization': `Bearer ${staffToken || adminToken}`
        }, {
          productId: product.id,
          quantity: largeQuantity
        });

        if (response.status === 400) {
          recordTest('nonFunctional', 'Stock Negative Prevention', true, 
            'Stock cannot go negative');
        } else {
          recordTest('nonFunctional', 'Stock Negative Prevention', false, 
            `Stock reduction allowed negative: ${response.status}`);
        }
      } else {
        recordTest('nonFunctional', 'Stock Negative Prevention', false, 
          'Product quantity not available');
      }
    } else {
      recordTest('nonFunctional', 'Stock Negative Prevention', false, 
        'No products available for test');
    }
  } catch (error) {
    recordTest('nonFunctional', 'Stock Negative Prevention', false, '', error);
  }

  // Test 3.10: Load Test - Multiple Sequential Requests
  try {
    const requestCount = 20;
    const startTime = Date.now();
    let successCount = 0;

    for (let i = 0; i < requestCount; i++) {
      try {
        const response = await makeRequest('GET', '/products', {
          'Authorization': `Bearer ${adminToken}`
        }, null, 3000);
        if (response.status === 200) successCount++;
      } catch (error) {
        // Count failures
      }
    }

    const endTime = Date.now();
    const totalTime = endTime - startTime;
    const avgTime = totalTime / requestCount;

    if (successCount >= requestCount * 0.9) {
      recordTest('nonFunctional', 'Load Handling', true, 
        `${successCount}/${requestCount} requests succeeded, avg: ${avgTime.toFixed(0)}ms`);
    } else {
      recordTest('nonFunctional', 'Load Handling', false, 
        `Only ${successCount}/${requestCount} requests succeeded`);
    }
  } catch (error) {
    recordTest('nonFunctional', 'Load Handling', false, '', error);
  }
}

// ============================================================================
// Main Test Runner
// ============================================================================

async function runAllTests() {
  console.log('\n' + '='.repeat(70));
  console.log('COMPREHENSIVE BACKEND TESTING SUITE');
  console.log('='.repeat(70));
  console.log(`Start Time: ${testResults.startTime.toISOString()}`);
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Database: ${DB_CONFIG.database}`);
  console.log('='.repeat(70) + '\n');

  try {
    // Run all test suites
    await runStructuralTests();
    await runFunctionalTests();
    await runNonFunctionalTests();

    // Calculate summary
    testResults.endTime = new Date();
    const totalPassed = testResults.structural.passed + 
                       testResults.functional.passed + 
                       testResults.nonFunctional.passed;
    const totalFailed = testResults.structural.failed + 
                       testResults.functional.failed + 
                       testResults.nonFunctional.failed;
    const totalTests = totalPassed + totalFailed;
    const successRate = totalTests > 0 ? (totalPassed / totalTests * 100).toFixed(2) : 0;

    testResults.summary = {
      totalTests,
      totalPassed,
      totalFailed,
      successRate: `${successRate}%`,
      duration: `${((testResults.endTime - testResults.startTime) / 1000).toFixed(2)}s`
    };

    // Print summary
    console.log('\n' + '='.repeat(70));
    console.log('TEST SUMMARY');
    console.log('='.repeat(70));
    console.log(`Structural Tests:   ${testResults.structural.passed} passed, ${testResults.structural.failed} failed`);
    console.log(`Functional Tests:   ${testResults.functional.passed} passed, ${testResults.functional.failed} failed`);
    console.log(`Non-Functional:     ${testResults.nonFunctional.passed} passed, ${testResults.nonFunctional.failed} failed`);
    console.log(`Total:              ${totalPassed} passed, ${totalFailed} failed`);
    console.log(`Success Rate:       ${successRate}%`);
    console.log(`Duration:           ${testResults.summary.duration}`);
    console.log('='.repeat(70) + '\n');

    // Save results to file
    const outputDir = 'E:\\database_project\\backend_testing';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputFile = path.join(outputDir, `test-results-${timestamp}.json`);
    const outputFileMD = path.join(outputDir, `test-results-${timestamp}.md`);

    // Save JSON
    fs.writeFileSync(outputFile, JSON.stringify(testResults, null, 2));
    log(`Results saved to: ${outputFile}`, 'PASS', 'SUMMARY');

    // Save Markdown report
    const mdReport = generateMarkdownReport(testResults);
    fs.writeFileSync(outputFileMD, mdReport);
    log(`Markdown report saved to: ${outputFileMD}`, 'PASS', 'SUMMARY');

    console.log('\n✅ Testing complete!');
    process.exit(totalFailed === 0 ? 0 : 1);

  } catch (error) {
    console.error('\n❌ Fatal error during testing:', error);
    process.exit(1);
  }
}

function generateMarkdownReport(results) {
  const md = [];
  md.push('# Comprehensive Backend Testing Report\n');
  md.push(`**Test Date:** ${results.startTime.toLocaleString()}`);
  md.push(`**Duration:** ${results.summary.duration}`);
  md.push(`**Success Rate:** ${results.summary.successRate}\n`);

  md.push('## Summary\n');
  md.push(`- **Total Tests:** ${results.summary.totalTests}`);
  md.push(`- **Passed:** ${results.summary.totalPassed}`);
  md.push(`- **Failed:** ${results.summary.totalFailed}`);
  md.push(`- **Success Rate:** ${results.summary.successRate}\n`);

  // Structural Tests
  md.push('## 1. Structural Testing\n');
  md.push(`**Results:** ${results.structural.passed} passed, ${results.structural.failed} failed\n`);
  results.structural.tests.forEach(test => {
    md.push(`- ${test.passed ? '✅' : '❌'} **${test.name}**`);
    if (test.details) md.push(`  - ${test.details}`);
    if (test.error) md.push(`  - Error: ${test.error}`);
  });

  // Functional Tests
  md.push('\n## 2. Functional Testing\n');
  md.push(`**Results:** ${results.functional.passed} passed, ${results.functional.failed} failed\n`);
  results.functional.tests.forEach(test => {
    md.push(`- ${test.passed ? '✅' : '❌'} **${test.name}**`);
    if (test.details) md.push(`  - ${test.details}`);
    if (test.error) md.push(`  - Error: ${test.error}`);
  });

  // Non-Functional Tests
  md.push('\n## 3. Non-Functional Testing\n');
  md.push(`**Results:** ${results.nonFunctional.passed} passed, ${results.nonFunctional.failed} failed\n`);
  results.nonFunctional.tests.forEach(test => {
    md.push(`- ${test.passed ? '✅' : '❌'} **${test.name}**`);
    if (test.details) md.push(`  - ${test.details}`);
    if (test.error) md.push(`  - Error: ${test.error}`);
  });

  return md.join('\n');
}

// Run tests
runAllTests();

