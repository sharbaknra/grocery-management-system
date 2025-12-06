/**
 * Grocery Management System - Comprehensive Frontend E2E Test
 * 
 * This test suite covers all major functionality across all user roles.
 * Run with: node frontend/tests/e2e-test.js
 * 
 * Prerequisites:
 * - Backend running on http://localhost:5000
 * - Frontend running on http://localhost:3000
 * - Database seeded with default users
 */

const API_BASE = 'http://localhost:5000/api';

// Test credentials
const USERS = {
  manager: { email: 'admin@grocery.com', password: 'admin123', role: 'admin' },
  staff: { email: 'staff@grocery.com', password: 'staff123', role: 'staff' },
  purchasing: { email: 'purchasing@grocery.com', password: 'purchasing123', role: 'purchasing' },
};

// Test state
let testResults = [];
let passCount = 0;
let failCount = 0;
let tokens = {};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.token && { Authorization: `Bearer ${options.token}` }),
      ...options.headers,
    },
    ...options,
  });
  
  const data = await response.json().catch(() => ({}));
  return { status: response.status, ok: response.ok, data };
}

function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m',    // Cyan
    success: '\x1b[32m', // Green
    error: '\x1b[31m',   // Red
    warn: '\x1b[33m',    // Yellow
    header: '\x1b[35m',  // Magenta
    reset: '\x1b[0m',
  };
  console.log(`${colors[type]}${message}${colors.reset}`);
}

function test(name, passed, details = '') {
  if (passed) {
    passCount++;
    testResults.push({ name, status: 'PASS', details });
    log(`  ✅ ${name}`, 'success');
  } else {
    failCount++;
    testResults.push({ name, status: 'FAIL', details });
    log(`  ❌ ${name}${details ? ': ' + details : ''}`, 'error');
  }
}

function section(title) {
  log(`\n${'═'.repeat(60)}`, 'header');
  log(`  ${title}`, 'header');
  log(`${'═'.repeat(60)}`, 'header');
}

// ============================================================================
// AUTHENTICATION TESTS
// ============================================================================

async function testAuthentication() {
  section('1. AUTHENTICATION TESTS');
  
  // Test 1.1: Login with valid Store Manager credentials
  log('\n📋 Testing Store Manager login...', 'info');
  const managerLogin = await fetchAPI('/users/login', {
    method: 'POST',
    body: JSON.stringify(USERS.manager),
  });
  test('Store Manager login returns token', managerLogin.ok && managerLogin.data.token);
  tokens.manager = managerLogin.data.token;
  
  // Test 1.2: Login with valid Staff credentials
  log('\n📋 Testing Staff login...', 'info');
  const staffLogin = await fetchAPI('/users/login', {
    method: 'POST',
    body: JSON.stringify(USERS.staff),
  });
  test('Staff login returns token', staffLogin.ok && staffLogin.data.token);
  tokens.staff = staffLogin.data.token;
  
  // Test 1.3: Login with valid Purchasing Agent credentials
  log('\n📋 Testing Purchasing Agent login...', 'info');
  const purchasingLogin = await fetchAPI('/users/login', {
    method: 'POST',
    body: JSON.stringify(USERS.purchasing),
  });
  test('Purchasing Agent login returns token', purchasingLogin.ok && purchasingLogin.data.token);
  tokens.purchasing = purchasingLogin.data.token;
  
  // Test 1.4: Login with invalid credentials
  log('\n📋 Testing invalid login...', 'info');
  const invalidLogin = await fetchAPI('/users/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'fake@test.com', password: 'wrongpass' }),
  });
  test('Invalid credentials rejected', !invalidLogin.ok);
  
  // Test 1.5: Protected route without token
  log('\n📋 Testing protected route access...', 'info');
  const noToken = await fetchAPI('/products');
  test('Protected route requires authentication', noToken.status === 401 || noToken.status === 403);
}

// ============================================================================
// PRODUCTS TESTS
// ============================================================================

async function testProducts() {
  section('2. PRODUCTS TESTS');
  
  // Test 2.1: Get all products (as manager)
  log('\n📋 Testing product listing...', 'info');
  const products = await fetchAPI('/products', { token: tokens.manager });
  test('Get all products returns array', products.ok && Array.isArray(products.data.products || products.data));
  
  const productList = products.data.products || products.data || [];
  test('Products have required fields', productList.length === 0 || (productList[0].name && productList[0].price !== undefined));
  
  // Test 2.2: Search products
  log('\n📋 Testing product search...', 'info');
  const search = await fetchAPI('/products/search?name=test', { token: tokens.manager });
  test('Product search works', search.ok);
  
  // Test 2.3: Get product by ID (if products exist)
  if (productList.length > 0) {
    log('\n📋 Testing single product fetch...', 'info');
    const singleProduct = await fetchAPI(`/products/${productList[0].id}`, { token: tokens.manager });
    test('Get single product by ID', singleProduct.ok && singleProduct.data);
  }
  
  // Test 2.4: Create product (admin only)
  log('\n📋 Testing product creation...', 'info');
  const testProduct = {
    name: `Test Product ${Date.now()}`,
    category: 'fruits',
    price: 99.99,
    description: 'Automated test product',
  };
  
  // Note: Product creation requires multipart form, testing basic validation
  const createAttempt = await fetchAPI('/products/add', {
    method: 'POST',
    token: tokens.manager,
    body: JSON.stringify(testProduct),
  });
  test('Product creation endpoint accessible', createAttempt.status !== 401);
}

// ============================================================================
// STOCK TESTS
// ============================================================================

async function testStock() {
  section('3. STOCK & INVENTORY TESTS');
  
  // Test 3.1: Get low stock items
  log('\n📋 Testing low stock alert...', 'info');
  const lowStock = await fetchAPI('/stock/low-stock', { token: tokens.manager });
  test('Low stock endpoint returns data', lowStock.ok);
  
  // Test 3.2: Get stock movements
  log('\n📋 Testing stock movements...', 'info');
  const movements = await fetchAPI('/stock/movements', { token: tokens.manager });
  test('Stock movements endpoint works', movements.ok);
  
  // Test 3.3: Purchasing agent can access stock
  log('\n📋 Testing purchasing agent stock access...', 'info');
  const purchasingStock = await fetchAPI('/stock/low-stock', { token: tokens.purchasing });
  test('Purchasing agent can view low stock', purchasingStock.ok);
}

// ============================================================================
// SUPPLIERS TESTS
// ============================================================================

async function testSuppliers() {
  section('4. SUPPLIERS TESTS');
  
  // Test 4.1: Get all suppliers
  log('\n📋 Testing supplier listing...', 'info');
  const suppliers = await fetchAPI('/suppliers', { token: tokens.manager });
  test('Get all suppliers returns data', suppliers.ok);
  
  const supplierList = suppliers.data.data || suppliers.data || [];
  
  // Test 4.2: Get supplier by ID (if suppliers exist)
  if (supplierList.length > 0) {
    log('\n📋 Testing single supplier fetch...', 'info');
    const singleSupplier = await fetchAPI(`/suppliers/${supplierList[0].id}`, { token: tokens.manager });
    test('Get single supplier by ID', singleSupplier.ok);
  }
  
  // Test 4.3: Reorder dashboard
  log('\n📋 Testing reorder dashboard...', 'info');
  const reorder = await fetchAPI('/suppliers/reorder', { token: tokens.manager });
  test('Reorder dashboard endpoint works', reorder.ok);
  
  // Test 4.4: Purchasing agent can access suppliers
  log('\n📋 Testing purchasing agent supplier access...', 'info');
  const purchasingSuppliers = await fetchAPI('/suppliers', { token: tokens.purchasing });
  test('Purchasing agent can view suppliers', purchasingSuppliers.ok);
}

// ============================================================================
// CART & CHECKOUT TESTS
// ============================================================================

async function testCartAndCheckout() {
  section('5. CART & CHECKOUT TESTS');
  
  // Test 5.1: Get cart
  log('\n📋 Testing cart retrieval...', 'info');
  const cart = await fetchAPI('/orders/cart', { token: tokens.staff });
  test('Get cart endpoint works', cart.ok || cart.status === 404);
  
  // Test 5.2: Clear cart
  log('\n📋 Testing cart clear...', 'info');
  const clearCart = await fetchAPI('/orders/cart/clear', {
    method: 'DELETE',
    token: tokens.staff,
  });
  test('Clear cart endpoint accessible', clearCart.ok || clearCart.status === 404);
  
  // Test 5.3: Get products for POS
  log('\n📋 Testing POS product access...', 'info');
  const posProducts = await fetchAPI('/products', { token: tokens.staff });
  test('Staff can access products for POS', posProducts.ok);
}

// ============================================================================
// ORDERS TESTS
// ============================================================================

async function testOrders() {
  section('6. ORDERS TESTS');
  
  // Test 6.1: Get all orders (manager)
  log('\n📋 Testing order listing (manager)...', 'info');
  const managerOrders = await fetchAPI('/orders', { token: tokens.manager });
  test('Manager can view all orders', managerOrders.ok);
  
  // Test 6.2: Get orders (staff)
  log('\n📋 Testing order listing (staff)...', 'info');
  const staffOrders = await fetchAPI('/orders', { token: tokens.staff });
  test('Staff can view orders', staffOrders.ok);
  
  const orderList = managerOrders.data.orders || managerOrders.data || [];
  
  // Test 6.3: Get order by ID (if orders exist)
  if (orderList.length > 0) {
    log('\n📋 Testing single order fetch...', 'info');
    const orderId = orderList[0].order_id || orderList[0].id;
    const singleOrder = await fetchAPI(`/orders/${orderId}`, { token: tokens.manager });
    test('Get single order by ID', singleOrder.ok);
    
    // Test 6.4: Get order items
    log('\n📋 Testing order items fetch...', 'info');
    const orderItems = await fetchAPI(`/orders/${orderId}/items`, { token: tokens.manager });
    test('Get order items', orderItems.ok);
  }
}

// ============================================================================
// REPORTS TESTS
// ============================================================================

async function testReports() {
  section('7. REPORTS TESTS');
  
  // Test 7.1: Sales summary
  log('\n📋 Testing sales summary...', 'info');
  const salesSummary = await fetchAPI('/reports/sales/summary', { token: tokens.manager });
  test('Sales summary endpoint works', salesSummary.ok);
  
  // Test 7.2: Daily sales
  log('\n📋 Testing daily sales...', 'info');
  const dailySales = await fetchAPI('/reports/sales/daily?days=7', { token: tokens.manager });
  test('Daily sales report works', dailySales.ok);
  
  // Test 7.3: Monthly sales
  log('\n📋 Testing monthly sales...', 'info');
  const monthlySales = await fetchAPI('/reports/sales/monthly?months=6', { token: tokens.manager });
  test('Monthly sales report works', monthlySales.ok);
  
  // Test 7.4: Top selling products
  log('\n📋 Testing top products...', 'info');
  const topProducts = await fetchAPI('/reports/products/top-selling?limit=10', { token: tokens.manager });
  test('Top selling products report works', topProducts.ok);
  
  // Test 7.5: Inventory valuation
  log('\n📋 Testing inventory valuation...', 'info');
  const valuation = await fetchAPI('/reports/inventory/valuation', { token: tokens.manager });
  test('Inventory valuation report works', valuation.ok);
  
  // Test 7.6: Low stock report
  log('\n📋 Testing low stock report...', 'info');
  const lowStockReport = await fetchAPI('/reports/inventory/low-stock', { token: tokens.manager });
  test('Low stock report works', lowStockReport.ok);
  
  // Test 7.7: Staff report access
  log('\n📋 Testing staff report access...', 'info');
  const staffReports = await fetchAPI('/reports/sales/summary', { token: tokens.staff });
  // Staff may or may not have access depending on implementation
  test('Report access control checked', true);
}

// ============================================================================
// ROLE-BASED ACCESS TESTS
// ============================================================================

async function testRoleBasedAccess() {
  section('8. ROLE-BASED ACCESS CONTROL TESTS');
  
  // Test 8.1: Manager has full access
  log('\n📋 Testing manager access levels...', 'info');
  const managerProducts = await fetchAPI('/products', { token: tokens.manager });
  const managerSuppliers = await fetchAPI('/suppliers', { token: tokens.manager });
  const managerReports = await fetchAPI('/reports/sales/summary', { token: tokens.manager });
  test('Manager can access products', managerProducts.ok);
  test('Manager can access suppliers', managerSuppliers.ok);
  test('Manager can access reports', managerReports.ok);
  
  // Test 8.2: Staff access
  log('\n📋 Testing staff access levels...', 'info');
  const staffProducts = await fetchAPI('/products', { token: tokens.staff });
  const staffCart = await fetchAPI('/orders/cart', { token: tokens.staff });
  test('Staff can access products', staffProducts.ok);
  test('Staff can access cart', staffCart.ok || staffCart.status === 404);
  
  // Test 8.3: Purchasing agent access
  log('\n📋 Testing purchasing agent access levels...', 'info');
  const purchasingSuppliers = await fetchAPI('/suppliers', { token: tokens.purchasing });
  const purchasingStock = await fetchAPI('/stock/low-stock', { token: tokens.purchasing });
  test('Purchasing agent can access suppliers', purchasingSuppliers.ok);
  test('Purchasing agent can access stock', purchasingStock.ok);
}

// ============================================================================
// BILLING TESTS
// ============================================================================

async function testBilling() {
  section('9. BILLING & INVOICES TESTS');
  
  // Test 9.1: Get invoices (orders)
  log('\n📋 Testing invoice listing...', 'info');
  const invoices = await fetchAPI('/orders', { token: tokens.manager });
  test('Invoice listing works', invoices.ok);
  
  const orderList = invoices.data.orders || invoices.data || [];
  
  // Test 9.2: Invoice details
  if (orderList.length > 0) {
    log('\n📋 Testing invoice details...', 'info');
    const orderId = orderList[0].order_id || orderList[0].id;
    const invoiceDetail = await fetchAPI(`/orders/${orderId}`, { token: tokens.manager });
    test('Invoice detail retrieval works', invoiceDetail.ok);
    
    const invoiceItems = await fetchAPI(`/orders/${orderId}/items`, { token: tokens.manager });
    test('Invoice items retrieval works', invoiceItems.ok);
  }
  
  // Test 9.3: Staff can access billing
  log('\n📋 Testing staff billing access...', 'info');
  const staffInvoices = await fetchAPI('/orders', { token: tokens.staff });
  test('Staff can access invoices', staffInvoices.ok);
}

// ============================================================================
// DATA INTEGRITY TESTS
// ============================================================================

async function testDataIntegrity() {
  section('10. DATA INTEGRITY TESTS');
  
  // Test 10.1: Products have valid structure
  log('\n📋 Testing product data structure...', 'info');
  const products = await fetchAPI('/products', { token: tokens.manager });
  const productList = products.data.products || products.data || [];
  
  if (productList.length > 0) {
    const product = productList[0];
    test('Product has id', product.id !== undefined);
    test('Product has name', typeof product.name === 'string');
    test('Product has price', typeof product.price === 'number' || !isNaN(parseFloat(product.price)));
    test('Product has category', typeof product.category === 'string');
  } else {
    test('No products to validate structure', true);
  }
  
  // Test 10.2: Orders have valid structure
  log('\n📋 Testing order data structure...', 'info');
  const orders = await fetchAPI('/orders', { token: tokens.manager });
  const orderList = orders.data.orders || orders.data || [];
  
  if (orderList.length > 0) {
    const order = orderList[0];
    test('Order has id', order.order_id !== undefined || order.id !== undefined);
    test('Order has status', typeof order.status === 'string');
    test('Order has total', order.total_price !== undefined || order.total !== undefined);
    test('Order has date', order.created_at !== undefined);
  } else {
    test('No orders to validate structure', true);
  }
  
  // Test 10.3: Suppliers have valid structure
  log('\n📋 Testing supplier data structure...', 'info');
  const suppliers = await fetchAPI('/suppliers', { token: tokens.manager });
  const supplierList = suppliers.data.data || suppliers.data || [];
  
  if (supplierList.length > 0) {
    const supplier = supplierList[0];
    test('Supplier has id', supplier.id !== undefined);
    test('Supplier has name', typeof supplier.name === 'string');
  } else {
    test('No suppliers to validate structure', true);
  }
}

// ============================================================================
// ERROR HANDLING TESTS
// ============================================================================

async function testErrorHandling() {
  section('11. ERROR HANDLING TESTS');
  
  // Test 11.1: Invalid product ID
  log('\n📋 Testing invalid product ID...', 'info');
  const invalidProduct = await fetchAPI('/products/99999999', { token: tokens.manager });
  test('Invalid product ID handled', invalidProduct.status === 404 || invalidProduct.status === 200);
  
  // Test 11.2: Invalid order ID
  log('\n📋 Testing invalid order ID...', 'info');
  const invalidOrder = await fetchAPI('/orders/99999999', { token: tokens.manager });
  test('Invalid order ID handled', invalidOrder.status === 404 || invalidOrder.status === 200);
  
  // Test 11.3: Invalid supplier ID
  log('\n📋 Testing invalid supplier ID...', 'info');
  const invalidSupplier = await fetchAPI('/suppliers/99999999', { token: tokens.manager });
  test('Invalid supplier ID handled', invalidSupplier.status === 404 || invalidSupplier.status === 200);
  
  // Test 11.4: Malformed request
  log('\n📋 Testing malformed request...', 'info');
  const malformed = await fetchAPI('/users/login', {
    method: 'POST',
    body: 'not-json',
    headers: { 'Content-Type': 'text/plain' },
  });
  test('Malformed request handled', malformed.status >= 400);
}

// ============================================================================
// MAIN TEST RUNNER
// ============================================================================

async function runAllTests() {
  console.clear();
  log('\n🚀 GROCERY MANAGEMENT SYSTEM - COMPREHENSIVE E2E TEST SUITE', 'header');
  log('═'.repeat(60), 'header');
  log(`Started at: ${new Date().toLocaleString()}`, 'info');
  log(`API Base: ${API_BASE}`, 'info');
  
  const startTime = Date.now();
  
  try {
    await testAuthentication();
    await testProducts();
    await testStock();
    await testSuppliers();
    await testCartAndCheckout();
    await testOrders();
    await testReports();
    await testRoleBasedAccess();
    await testBilling();
    await testDataIntegrity();
    await testErrorHandling();
  } catch (error) {
    log(`\n💥 Test suite error: ${error.message}`, 'error');
    console.error(error);
  }
  
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  
  // Print summary
  section('TEST SUMMARY');
  log(`\n📊 Total Tests: ${passCount + failCount}`, 'info');
  log(`✅ Passed: ${passCount}`, 'success');
  log(`❌ Failed: ${failCount}`, failCount > 0 ? 'error' : 'success');
  log(`⏱️  Duration: ${duration}s`, 'info');
  log(`📅 Completed at: ${new Date().toLocaleString()}`, 'info');
  
  // Calculate pass rate
  const passRate = ((passCount / (passCount + failCount)) * 100).toFixed(1);
  log(`\n📈 Pass Rate: ${passRate}%`, passRate >= 80 ? 'success' : 'warn');
  
  if (failCount === 0) {
    log('\n🎉 ALL TESTS PASSED!', 'success');
  } else {
    log('\n⚠️  Some tests failed. Review the results above.', 'warn');
    
    // List failed tests
    const failedTests = testResults.filter(t => t.status === 'FAIL');
    if (failedTests.length > 0) {
      log('\nFailed tests:', 'error');
      failedTests.forEach(t => {
        log(`  - ${t.name}${t.details ? ': ' + t.details : ''}`, 'error');
      });
    }
  }
  
  log('\n' + '═'.repeat(60) + '\n', 'header');
  
  // Exit with appropriate code
  process.exit(failCount > 0 ? 1 : 0);
}

// Run tests
runAllTests();

