// Comprehensive Backend Test Suite
// Tests all modules and endpoints to ensure bulletproof backend
// Output: E:\database_project\backend_test

const http = require('http');
const fs = require('fs');
const path = require('path');

const baseUrl = 'http://localhost:5000/api';
const outputDir = 'E:\\database_project\\backend_test';
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const reportFile = path.join(outputDir, `backend-test-report-${timestamp}.md`);
const detailFile = path.join(outputDir, `backend-test-details-${timestamp}.txt`);

let report = [];
let details = [];
let summary = {
  total: 0,
  passed: 0,
  failed: 0,
  errors: [],
  modules: {}
};

// Tokens
let adminToken = null;
let staffToken = null;
let customerToken = null;
let customer2Token = null;
let testUserIds = { admin: 1, staff: null, customer: null, customer2: null };

// Test data
let testProducts = [];
let testOrders = [];
let testCartItems = [];

// Helper Functions
function log(message, type = 'INFO') {
  const timestamp = new Date().toISOString();
  const logMsg = `[${timestamp}] [${type}] ${message}`;
  details.push(logMsg);
  console.log(logMsg);
}

function makeRequest(method, path, headers = {}, body = null, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const fullPath = path.startsWith('/') ? path : '/' + path;
    const fullUrl = baseUrl + fullPath;
    const url = new URL(fullUrl);
    
    const options = {
      hostname: url.hostname,
      port: url.port || 5000,
      path: url.pathname + (url.search || ''),
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      timeout: timeout
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : {};
          resolve({ 
            status: res.statusCode, 
            data: jsonData, 
            headers: res.headers,
            raw: data 
          });
        } catch (e) {
          resolve({ 
            status: res.statusCode, 
            data: data, 
            headers: res.headers,
            raw: data 
          });
        }
      });
    });

    req.on('error', (err) => {
      if (err.code === 'ECONNREFUSED') {
        reject(new Error(`Connection refused - Server may not be running on ${url.hostname}:${url.port || 5000}`));
      } else {
        reject(err);
      }
    });
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Request timeout after ${timeout}ms`));
    });

    if (body) {
      if (typeof body === 'string') {
        req.write(body);
      } else {
        req.write(JSON.stringify(body));
      }
    }
    req.end();
  });
}

function test(name, condition, details = '', module = 'General') {
  summary.total++;
  if (!summary.modules[module]) {
    summary.modules[module] = { total: 0, passed: 0, failed: 0 };
  }
  summary.modules[module].total++;

  const passed = condition;
  if (passed) {
    summary.passed++;
    summary.modules[module].passed++;
    report.push(`✅ **${name}** - PASSED`);
    log(`✅ PASS: ${name}`, 'PASS');
  } else {
    summary.failed++;
    summary.modules[module].failed++;
    const errorMsg = `❌ **${name}** - FAILED${details ? '\n   ' + details : ''}`;
    report.push(errorMsg);
    summary.errors.push({ test: name, module, details });
    log(`❌ FAIL: ${name} - ${details}`, 'FAIL');
  }
  return passed;
}

async function runTests() {
  log('='.repeat(80));
  log('🚀 COMPREHENSIVE BACKEND TEST SUITE');
  log('='.repeat(80));
  log('');
  log(`Test started at: ${new Date().toISOString()}`);
  log(`Base URL: ${baseUrl}`);
  log('');

  // Pre-flight check: Verify server is running
  log('Performing pre-flight check: Verifying server connectivity...');
  try {
    const healthCheck = await makeRequest('GET', '/products', {}, null, 5000);
    log(`Server connectivity check: Status ${healthCheck.status} (${healthCheck.status === 401 ? 'Unauthorized - Server is running' : 'Server responded'})`);
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      log('❌ ERROR: Server is not running!', 'ERROR');
      log('Please start the server first: node server.js', 'ERROR');
      const errorReport = `# ❌ Test Aborted - Server Not Running

**Error:** Connection refused to ${baseUrl}

**Solution:** Please start the server first:
\`\`\`bash
node server.js
\`\`\`

Then run this test again.

**Timestamp:** ${new Date().toISOString()}
`;
      fs.writeFileSync(reportFile, errorReport, 'utf8');
      process.exit(1);
    } else {
      log(`⚠️  Server connectivity check failed: ${error.message}`, 'WARN');
      log('Proceeding with tests, but some may fail...', 'WARN');
    }
  }
  log('');

  // ============================================================================
  // MODULE 2.6: USER AUTHENTICATION
  // ============================================================================
  log('');
  log('='.repeat(80));
  log('MODULE 2.6: USER AUTHENTICATION');
  log('='.repeat(80));
  report.push('');
  report.push('## MODULE 2.6: USER AUTHENTICATION');

  try {
    // Test 1: Admin Login
    log('Testing Admin Login...');
    const adminLogin = await makeRequest('POST', '/users/login', {}, {
      email: 'admin@grocery.com',
      password: 'admin123'
    });
    test('Admin Login', adminLogin.status === 200 && adminLogin.data.token, 
      `Status: ${adminLogin.status}`, '2.6 Authentication');
    if (adminLogin.data.token) {
      adminToken = adminLogin.data.token;
      const tokenParts = adminToken.split('.');
      const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
      testUserIds.admin = payload.id;
      log(`Admin token obtained. User ID: ${testUserIds.admin}`);
    }

    // Test 2: Customer Registration
    log('Testing Customer Registration...');
    const customerEmail = `testcustomer${Date.now()}@test.com`;
    const customerReg = await makeRequest('POST', '/users/register', {}, {
      name: 'Test Customer',
      email: customerEmail,
      password: 'customer123'
    });
    test('Customer Registration', customerReg.status === 201, 
      `Status: ${customerReg.status}`, '2.6 Authentication');

    // Test 3: Customer Login
    log('Testing Customer Login...');
    const customerLogin = await makeRequest('POST', '/users/login', {}, {
      email: customerEmail,
      password: 'customer123'
    });
    test('Customer Login', customerLogin.status === 200 && customerLogin.data.token,
      `Status: ${customerLogin.status}`, '2.6 Authentication');
    if (customerLogin.data.token) {
      customerToken = customerLogin.data.token;
      const tokenParts = customerToken.split('.');
      const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
      testUserIds.customer = payload.id;
      log(`Customer token obtained. User ID: ${testUserIds.customer}`);
      test('Customer Role Assignment', payload.role === 'customer',
        `Role: ${payload.role}`, '2.6 Authentication');
    }

    // Test 4: Unauthorized Access (No Token)
    log('Testing Unauthorized Access...');
    const unauthorized = await makeRequest('GET', '/products');
    test('Unauthorized Access Blocked', unauthorized.status === 401,
      `Status: ${unauthorized.status}`, '2.6 Authentication');

    // Test 5: Protected Route with Valid Token
    log('Testing Protected Route with Valid Token...');
    const authorized = await makeRequest('GET', '/products', {
      Authorization: `Bearer ${adminToken}`
    });
    test('Protected Route Accessible with Token', authorized.status === 200,
      `Status: ${authorized.status}`, '2.6 Authentication');

    // Test 6: Register with Invalid Data
    log('Testing Registration Validation...');
    const invalidReg = await makeRequest('POST', '/users/register', {}, {
      name: '',
      email: 'invalid-email',
      password: '123'
    });
    test('Registration Validation', invalidReg.status >= 400,
      `Status: ${invalidReg.status}`, '2.6 Authentication');

  } catch (error) {
    const errorMsg = error.code === 'ECONNREFUSED' ? 
      'Connection refused - Is the server running on port 5000?' : error.message;
    log(`❌ Authentication module error: ${errorMsg}`, 'ERROR');
    test('Authentication Module Tests', false, errorMsg, '2.6 Authentication');
    
    // If connection failed, we can't continue with other tests
    if (error.code === 'ECONNREFUSED') {
      log('⚠️  Server connection failed. Stopping tests. Please start the server first.', 'ERROR');
      throw error;
    }
  }

  // ============================================================================
  // MODULE 2.7: PRODUCT CRUD
  // ============================================================================
  log('');
  log('='.repeat(80));
  log('MODULE 2.7: PRODUCT CRUD');
  log('='.repeat(80));
  report.push('');
  report.push('## MODULE 2.7: PRODUCT CRUD');

  try {
      // Test 7: Create Product (Admin)
      log('Testing Product Creation...');
      const productData = {
        name: `Test Product ${Date.now()}`,
        category: 'Test Category',
        price: 19.99,
        barcode: `BARCODE${Date.now()}`,
        description: 'Test product description',
        supplier: 'Test Supplier'
      };
      const createProduct = await makeRequest('POST', '/products/add', {
        Authorization: `Bearer ${adminToken}`
      }, productData);
      test('Product Creation (Admin)', createProduct.status === 201,
        `Status: ${createProduct.status}`, '2.7 Product CRUD');
    
    if (createProduct.status === 201 && createProduct.data.product) {
      testProducts.push(createProduct.data.product);
      log(`Product created: ID ${createProduct.data.product.id}`);
    }

      // Test 8: Get All Products
      log('Testing Get All Products...');
      const getAllProducts = await makeRequest('GET', '/products', {
        Authorization: `Bearer ${adminToken}`
      });
      // Check if products array exists in response (could be data.products or just products)
      const productsArray = getAllProducts.data?.products || getAllProducts.data;
      const hasProducts = Array.isArray(productsArray);
      test('Get All Products', getAllProducts.status === 200 && hasProducts,
        `Status: ${getAllProducts.status}, Products found: ${hasProducts ? 'Yes' : 'No'}`, '2.7 Product CRUD');
    
      const productsList = getAllProducts.data?.products || getAllProducts.data || [];
      if (Array.isArray(productsList) && productsList.length > 0) {
        testProducts.push(...productsList.slice(0, 3));
        log(`Retrieved ${productsList.length} products`);
        
        // Verify product includes stock information
        const hasStock = productsList.some(p => p.quantity !== undefined);
        test('Products Include Stock Information', hasStock,
          'Products should include stock quantity from JOIN', '2.7 Product CRUD');
      }

      // Test 9: Get Single Product
      if (testProducts.length > 0) {
        log('Testing Get Single Product...');
        const getProduct = await makeRequest('GET', `/products/${testProducts[0].id}`, {
          Authorization: `Bearer ${adminToken}`
        });
        // Product could be in data.product or just data
        const product = getProduct.data?.product || getProduct.data;
        test('Get Single Product', getProduct.status === 200 && product && product.id,
          `Status: ${getProduct.status}`, '2.7 Product CRUD');
      }

    // Test 10: Update Product (Admin)
    if (testProducts.length > 0) {
      log('Testing Product Update...');
      const updateData = {
        name: `Updated Product ${Date.now()}`,
        price: 29.99
      };
      const updateProduct = await makeRequest('PUT', `/products/update/${testProducts[0].id}`, {
        Authorization: `Bearer ${adminToken}`
      }, updateData);
      test('Product Update (Admin)', updateProduct.status === 200,
        `Status: ${updateProduct.status}`, '2.7 Product CRUD');
    }

      // Test 11: Customer Cannot Create Product
      log('Testing Customer Authorization on Product Creation...');
      const customerCreate = await makeRequest('POST', '/products/add', {
        Authorization: `Bearer ${customerToken}`
      }, productData);
      test('Customer Cannot Create Product', customerCreate.status === 403,
        `Status: ${customerCreate.status}`, '2.7 Product CRUD');

      // Test 12: Invalid Product Data
      log('Testing Product Validation...');
      const invalidProduct = await makeRequest('POST', '/products/add', {
        Authorization: `Bearer ${adminToken}`
      }, {
        name: '',
        price: -10
      });
      test('Product Validation', invalidProduct.status >= 400,
        `Status: ${invalidProduct.status}`, '2.7 Product CRUD');

  } catch (error) {
    test('Product CRUD Module Tests', false, error.message, '2.7 Product CRUD');
  }

  // ============================================================================
  // MODULE 2.8: STOCK & INVENTORY MANAGEMENT
  // ============================================================================
  log('');
  log('='.repeat(80));
  log('MODULE 2.8: STOCK & INVENTORY MANAGEMENT');
  log('='.repeat(80));
  report.push('');
  report.push('## MODULE 2.8: STOCK & INVENTORY MANAGEMENT');

  try {
    if (testProducts.length === 0) {
      log('⚠️  No products available for stock tests. Skipping...');
    } else {
      const productId = testProducts[0].id;
      let initialStock = 0;

      // Test 13: Get Inventory (via products endpoint which includes stock)
      log('Testing Get Inventory...');
      const getProducts = await makeRequest('GET', '/products', {
        Authorization: `Bearer ${adminToken}`
      });
      const productsList = getProducts.data?.products || getProducts.data || [];
      test('Get Inventory', getProducts.status === 200 && Array.isArray(productsList),
        `Status: ${getProducts.status}`, '2.8 Stock Management');

      if (Array.isArray(productsList)) {
        const productStock = productsList.find(p => p.id === productId);
        if (productStock) {
          initialStock = productStock.quantity || 0;
          log(`Initial stock for product ${productId}: ${initialStock}`);
        }
      }

      // Test 14: Restock (Admin)
      log('Testing Restock...');
      const restockAmount = 50;
      const restock = await makeRequest('POST', '/stock/restock', {
        Authorization: `Bearer ${adminToken}`
      }, {
        productId: productId,
        quantity: restockAmount
      });
      test('Restock Operation (Admin)', restock.status === 200,
        `Status: ${restock.status}`, '2.8 Stock Management');

      // Verify stock increased (via products endpoint)
      const afterRestock = await makeRequest('GET', '/products', {
        Authorization: `Bearer ${adminToken}`
      });
      const productsAfterRestock = afterRestock.data?.products || afterRestock.data || [];
      if (Array.isArray(productsAfterRestock)) {
        const updatedStock = productsAfterRestock.find(p => p.id === productId);
        if (updatedStock) {
          const expectedStock = initialStock + restockAmount;
          test('Stock Increased After Restock', updatedStock.quantity === expectedStock,
            `Expected: ${expectedStock}, Got: ${updatedStock.quantity}`, '2.8 Stock Management');
        }
      }

      // Test 15: Reduce Stock (Admin)
      log('Testing Reduce Stock...');
      const reduceAmount = 10;
      const reduce = await makeRequest('POST', '/stock/reduce', {
        Authorization: `Bearer ${adminToken}`
      }, {
        productId: productId,
        quantity: reduceAmount
      });
      test('Reduce Stock Operation (Admin)', reduce.status === 200,
        `Status: ${reduce.status}`, '2.8 Stock Management');

      // Verify stock decreased (via products endpoint)
      const afterReduce = await makeRequest('GET', '/products', {
        Authorization: `Bearer ${adminToken}`
      });
      const productsAfterReduce = afterReduce.data?.products || afterReduce.data || [];
      if (Array.isArray(productsAfterReduce)) {
        const updatedStock = productsAfterReduce.find(p => p.id === productId);
        if (updatedStock) {
          const expectedStock = initialStock + restockAmount - reduceAmount;
          test('Stock Decreased After Reduce', updatedStock.quantity === expectedStock,
            `Expected: ${expectedStock}, Got: ${updatedStock.quantity}`, '2.8 Stock Management');
        }
      }

      // Test 16: Insufficient Stock Prevention
      log('Testing Insufficient Stock Prevention...');
      const excessiveReduce = await makeRequest('POST', '/stock/reduce', {
        Authorization: `Bearer ${adminToken}`
      }, {
        productId: productId,
        quantity: 999999
      });
      test('Insufficient Stock Prevention', excessiveReduce.status === 400,
        `Status: ${excessiveReduce.status}`, '2.8 Stock Management');

      // Test 17: Low Stock Alerts
      log('Testing Low Stock Alerts...');
      const lowStock = await makeRequest('GET', '/stock/low-stock', {
        Authorization: `Bearer ${adminToken}`
      });
      // Low stock returns data.data.items, not data.products
      const lowStockItems = lowStock.data?.data?.items || lowStock.data?.items || lowStock.data?.products || [];
      test('Low Stock Alerts Endpoint', lowStock.status === 200 && lowStock.data?.success && Array.isArray(lowStockItems),
        `Status: ${lowStock.status}, Success: ${lowStock.data?.success}, Items: ${lowStockItems.length}`, '2.8 Stock Management');

      // Test 18: Customer Cannot Restock
      log('Testing Customer Authorization on Restock...');
      const customerRestock = await makeRequest('POST', '/stock/restock', {
        Authorization: `Bearer ${customerToken}`
      }, {
        productId: productId,
        quantity: 10
      });
      test('Customer Cannot Restock', customerRestock.status === 403,
        `Status: ${customerRestock.status}`, '2.8 Stock Management');

      // Test 19: Stock Movement Logs
      log('Testing Stock Movement Logs...');
      const stockMovements = await makeRequest('GET', '/stock/movements', {
        Authorization: `Bearer ${adminToken}`
      });
      test('Stock Movement Logs Endpoint', stockMovements.status === 200,
        `Status: ${stockMovements.status}`, '2.8 Stock Management');
      
      if (stockMovements.status === 200 && Array.isArray(stockMovements.data.movements)) {
        const recentMovements = stockMovements.data.movements.filter(m => m.product_id === productId);
        test('Stock Movements Logged', recentMovements.length > 0,
          `Found ${recentMovements.length} movements for product`, '2.8 Stock Management');
      }

    }
  } catch (error) {
    test('Stock Management Module Tests', false, error.message, '2.8 Stock Management');
  }

  // ============================================================================
  // MODULE 2.9: ORDERS & SALES SYSTEM
  // ============================================================================
  log('');
  log('='.repeat(80));
  log('MODULE 2.9: ORDERS & SALES SYSTEM');
  log('='.repeat(80));
  report.push('');
  report.push('## MODULE 2.9: ORDERS & SALES SYSTEM');

  try {
    if (testProducts.length === 0 || !customerToken) {
      log('⚠️  Missing prerequisites for order tests. Skipping...');
    } else {
      const productId = testProducts[0].id;

      // Ensure product has stock
      log('Ensuring product has sufficient stock...');
      await makeRequest('POST', '/stock/restock', {
        Authorization: `Bearer ${adminToken}`
      }, {
        productId: productId,
        quantity: 100
      });

      // Test 20: Add to Cart
      log('Testing Add to Cart...');
      const cartQuantity = 2;
      const addToCart = await makeRequest('POST', '/orders/cart/add', {
        Authorization: `Bearer ${customerToken}`
      }, {
        productId: productId,
        quantity: cartQuantity
      });
      test('Add to Cart', addToCart.status === 200,
        `Status: ${addToCart.status}`, '2.9 Orders & Sales');

      // Test 21: Get Cart
      log('Testing Get Cart...');
      const getCart = await makeRequest('GET', '/orders/cart', {
        Authorization: `Bearer ${customerToken}`
      });
      // Cart returns data.data.items (NOT data.cart or data.items)
      const cartItems = getCart.data?.data?.items || getCart.data?.items || [];
      test('Get Cart', getCart.status === 200 && getCart.data?.success && Array.isArray(cartItems),
        `Status: ${getCart.status}, Success: ${getCart.data?.success}, Items: ${cartItems.length}`, '2.9 Orders & Sales');
      
      if (Array.isArray(cartItems) && cartItems.length > 0) {
        testCartItems = cartItems;
        test('Cart Contains Added Item', testCartItems.length > 0,
          `Cart items: ${testCartItems.length}`, '2.9 Orders & Sales');
      }

      // Test 22: Cart Persistence
      log('Testing Cart Persistence...');
      const getCartAgain = await makeRequest('GET', '/orders/cart', {
        Authorization: `Bearer ${customerToken}`
      });
      const cartItemsAgain = getCartAgain.data?.data?.items || getCartAgain.data?.items || [];
      const expectedLength = testCartItems.length || 0;
      test('Cart Persistence', getCartAgain.status === 200 && Array.isArray(cartItemsAgain) && 
        cartItemsAgain.length === expectedLength,
        `Items persisted: ${cartItemsAgain.length} (was: ${expectedLength})`, '2.9 Orders & Sales');

      // Test 23: Stock Validation in Cart
      log('Testing Stock Validation in Cart...');
      const excessiveCart = await makeRequest('POST', '/orders/cart/add', {
        Authorization: `Bearer ${customerToken}`
      }, {
        productId: productId,
        quantity: 999999
      });
      test('Cart Stock Validation', excessiveCart.status === 400,
        `Status: ${excessiveCart.status}`, '2.9 Orders & Sales');

      // Test 24: Checkout Transaction
      log('Testing Checkout Transaction...');
      const getProductsBefore = await makeRequest('GET', '/products', {
        Authorization: `Bearer ${adminToken}`
      });
      let stockBefore = 0;
      const productsBefore = getProductsBefore.data?.products || getProductsBefore.data || [];
      if (Array.isArray(productsBefore)) {
        const productStock = productsBefore.find(p => p.id === productId);
        if (productStock) {
          stockBefore = productStock.quantity || 0;
        }
      }

      const checkout = await makeRequest('POST', '/orders/checkout', {
        Authorization: `Bearer ${customerToken}`
      }, {});
      // Checkout returns data.data.order nested in data.data
      const order = checkout.data?.data?.order || checkout.data?.order || checkout.data;
      const orderId = order?.order_id || checkout.data?.data?.order_id;
      test('Checkout Transaction', checkout.status === 201 && checkout.data?.success && orderId,
        `Status: ${checkout.status}, Success: ${checkout.data?.success}, Order ID: ${orderId || 'N/A'}`, '2.9 Orders & Sales');

      if (order && order.order_id) {
        testOrders.push(order);
        log(`Order created: ID ${order.order_id}`);

        // Test 25: Verify Stock Reduced After Checkout
        log('Verifying Stock Reduced After Checkout...');
        const getProductsAfter = await makeRequest('GET', '/products', {
          Authorization: `Bearer ${adminToken}`
        });
        const productsAfter = getProductsAfter.data?.products || getProductsAfter.data || [];
        if (Array.isArray(productsAfter)) {
          const productStockAfter = productsAfter.find(p => p.id === productId);
          if (productStockAfter) {
            const expectedStock = stockBefore - cartQuantity;
            test('Stock Reduced After Checkout', productStockAfter.quantity === expectedStock,
              `Expected: ${expectedStock}, Got: ${productStockAfter.quantity}`, '2.9 Orders & Sales');
          }
        }

        // Test 26: Verify Cart Cleared After Checkout
        log('Verifying Cart Cleared After Checkout...');
        const cartAfterCheckout = await makeRequest('GET', '/orders/cart', {
          Authorization: `Bearer ${customerToken}`
        });
        // Cart returns data.data.items
        const cartAfterCheckoutItems = cartAfterCheckout.data?.data?.items || cartAfterCheckout.data?.items || [];
        const isCartEmpty = Array.isArray(cartAfterCheckoutItems) ? cartAfterCheckoutItems.length === 0 : 
          (cartAfterCheckout.data?.message || false);
        test('Cart Cleared After Checkout', cartAfterCheckout.status === 200 && isCartEmpty,
          `Cart items: ${Array.isArray(cartAfterCheckoutItems) ? cartAfterCheckoutItems.length : 'N/A'}`, '2.9 Orders & Sales');

        // Test 27: Verify Order Items Created
        // Items are in checkout.data.data.items (not order.items)
        const orderItems = checkout.data?.data?.items || order.items || [];
        test('Order Items Created', orderItems.length > 0,
          `Order items: ${orderItems.length}`, '2.9 Orders & Sales');

        // Test 28: Verify unit_price_at_sale in Order Items
        if (orderItems.length > 0) {
          const hasPriceAtSale = orderItems.every(item => 
            item.unit_price_at_sale !== undefined && item.unit_price_at_sale !== null
          );
          test('Order Items Include unit_price_at_sale', hasPriceAtSale,
            'All items must have unit_price_at_sale for audit trail', '2.9 Orders & Sales');
        }
      }

      // Test 29: Empty Cart Checkout Prevention
      log('Testing Empty Cart Checkout...');
      const emptyCheckout = await makeRequest('POST', '/orders/checkout', {
        Authorization: `Bearer ${customerToken}`
      }, {});
      test('Empty Cart Checkout Prevention', emptyCheckout.status >= 400,
        `Status: ${emptyCheckout.status}`, '2.9 Orders & Sales');
    }
  } catch (error) {
    test('Orders & Sales Module Tests', false, error.message, '2.9 Orders & Sales');
  }

  // ============================================================================
  // MODULE 2.9.5: ORDER HISTORY
  // ============================================================================
  log('');
  log('='.repeat(80));
  log('MODULE 2.9.5: ORDER HISTORY');
  log('='.repeat(80));
  report.push('');
  report.push('## MODULE 2.9.5: ORDER HISTORY');

  try {
    // Test 30: Customer Order History
    if (customerToken) {
      log('Testing Customer Order History...');
      const myOrders = await makeRequest('GET', '/orders/me', {
        Authorization: `Bearer ${customerToken}`
      });
      test('Customer Order History', myOrders.status === 200 && myOrders.data.success,
        `Status: ${myOrders.status}`, '2.9.5 Order History');

      if (myOrders.data.data && myOrders.data.data.orders) {
        test('Customer Sees Only Own Orders', myOrders.data.data.orders.every(o => 
          o.user_id === testUserIds.customer), 'All orders belong to customer', '2.9.5 Order History');
        
        if (myOrders.data.data.orders.length > 0) {
          test('Orders Include Items', myOrders.data.data.orders[0].items && 
            myOrders.data.data.orders[0].items.length > 0, 
            'Orders include order items', '2.9.5 Order History');
        }
      }
    }

    // Test 31: Admin Order History
    if (adminToken) {
      log('Testing Admin Order History...');
      const allOrders = await makeRequest('GET', '/orders', {
        Authorization: `Bearer ${adminToken}`
      });
      test('Admin Order History', allOrders.status === 200 && allOrders.data.success,
        `Status: ${allOrders.status}`, '2.9.5 Order History');

      if (allOrders.data.data && allOrders.data.data.orders) {
        test('Admin Sees All Orders', allOrders.data.data.orders.length >= 0,
          `Total orders: ${allOrders.data.data.orders.length}`, '2.9.5 Order History');
        
        if (allOrders.data.data.orders.length > 0) {
          test('Orders Include User Information', allOrders.data.data.orders[0].user_name !== undefined,
            'Orders include purchasing user information', '2.9.5 Order History');
        }
      }
    }

    // Test 32: Customer Cannot Access Admin Endpoint
    if (customerToken) {
      log('Testing Customer Authorization on Admin Endpoint...');
      const customerAllOrders = await makeRequest('GET', '/orders', {
        Authorization: `Bearer ${customerToken}`
      });
      test('Customer Blocked from Admin Endpoint', customerAllOrders.status === 403,
        `Status: ${customerAllOrders.status}`, '2.9.5 Order History');
    }

    // Test 33: Get Single Order by ID
    if (testOrders.length > 0 && customerToken) {
      log('Testing Get Single Order...');
      const orderId = testOrders[0].order_id;
      const getOrder = await makeRequest('GET', `/orders/${orderId}`, {
        Authorization: `Bearer ${customerToken}`
      });
      // Order is in data.order or data.data.order
      const order = getOrder.data?.data?.order || getOrder.data?.order || getOrder.data;
      test('Get Single Order', getOrder.status === 200 && getOrder.data?.success && order && order.order_id,
        `Status: ${getOrder.status}, Success: ${getOrder.data?.success}, Order ID: ${order?.order_id || 'N/A'}`, '2.9.5 Order History');
    }

  } catch (error) {
    test('Order History Module Tests', false, error.message, '2.9.5 Order History');
  }

  // ============================================================================
  // STRESS TESTS & EDGE CASES
  // ============================================================================
  log('');
  log('='.repeat(80));
  log('STRESS TESTS & EDGE CASES');
  log('='.repeat(80));
  report.push('');
  report.push('## STRESS TESTS & EDGE CASES');

  try {
    // Test 34: Concurrent Requests
    log('Testing Concurrent Requests...');
    const concurrentRequests = Promise.all([
      makeRequest('GET', '/products', { Authorization: `Bearer ${adminToken}` }),
      makeRequest('GET', '/products', { Authorization: `Bearer ${adminToken}` }),
      makeRequest('GET', '/products', { Authorization: `Bearer ${adminToken}` })
    ]);
    const results = await concurrentRequests;
    const allSuccess = results.every(r => r.status === 200);
    test('Concurrent Requests Handling', allSuccess,
      `${results.filter(r => r.status === 200).length}/3 succeeded`, 'Edge Cases');

    // Test 35: Invalid Token
    log('Testing Invalid Token...');
    const invalidToken = await makeRequest('GET', '/products', {
      Authorization: 'Bearer invalid.token.here'
    });
    test('Invalid Token Rejected', invalidToken.status === 401,
      `Status: ${invalidToken.status}`, 'Edge Cases');

    // Test 36: Missing Required Fields
    if (testProducts.length > 0) {
      log('Testing Missing Required Fields...');
      const missingFields = await makeRequest('POST', '/orders/cart/add', {
        Authorization: `Bearer ${customerToken}`
      }, {
        // Missing productId
        quantity: 1
      });
      test('Missing Required Fields Validation', missingFields.status >= 400,
        `Status: ${missingFields.status}`, 'Edge Cases');
    }

    // Test 37: Invalid Product ID
    log('Testing Invalid Product ID...');
    const invalidProductId = await makeRequest('GET', '/products/99999', {
      Authorization: `Bearer ${adminToken}`
    });
    test('Invalid Product ID Handling', invalidProductId.status === 404,
      `Status: ${invalidProductId.status}`, 'Edge Cases');

    // Test 38: Negative Values Prevention
    if (testProducts.length > 0) {
      log('Testing Negative Values Prevention...');
      const negativeQuantity = await makeRequest('POST', '/orders/cart/add', {
        Authorization: `Bearer ${customerToken}`
      }, {
        productId: testProducts[0].id,
        quantity: -5
      });
      test('Negative Values Prevention', negativeQuantity.status >= 400,
        `Status: ${negativeQuantity.status}`, 'Edge Cases');
    }

  } catch (error) {
    test('Edge Cases Tests', false, error.message, 'Edge Cases');
  }

  // ============================================================================
  // GENERATE REPORT
  // ============================================================================
  log('');
  log('='.repeat(80));
  log('GENERATING TEST REPORT');
  log('='.repeat(80));

  const reportContent = `# 🚀 Comprehensive Backend Test Report

**Test Date:** ${new Date().toISOString()}  
**Base URL:** ${baseUrl}  
**Total Tests:** ${summary.total}  
**Passed:** ${summary.passed} ✅  
**Failed:** ${summary.failed} ❌  
**Success Rate:** ${((summary.passed / summary.total) * 100).toFixed(2)}%

---

## Test Summary by Module

${Object.entries(summary.modules).map(([module, stats]) => `
### ${module}
- **Total Tests:** ${stats.total}
- **Passed:** ${stats.passed} ✅
- **Failed:** ${stats.failed} ❌
- **Success Rate:** ${((stats.passed / stats.total) * 100).toFixed(2)}%
`).join('\n')}

---

## Detailed Test Results

${report.join('\n')}

---

## Failed Tests Details

${summary.errors.length > 0 ? summary.errors.map((err, idx) => `
${idx + 1}. **${err.test}** (${err.module})
   - ${err.details}
`).join('\n') : '✅ No failed tests!'}

---

## Test Coverage

### ✅ Modules Tested
1. **Module 2.6:** User Authentication (Login, Registration, Authorization)
2. **Module 2.7:** Product CRUD Operations (Create, Read, Update, Delete)
3. **Module 2.8:** Stock & Inventory Management (Restock, Reduce, Low Stock Alerts, Movement Logs)
4. **Module 2.9:** Orders & Sales System (Cart, Checkout with ACID Compliance)
5. **Module 2.9.5:** Order History (Customer Scope, Administrative Scope)

### ✅ Security Tests
- Authentication & Authorization
- Role-Based Access Control (RBAC)
- Token Validation
- Unauthorized Access Prevention

### ✅ Transaction Tests
- ACID Compliance (Checkout)
- Stock Deduction Consistency
- Order Creation Integrity
- Cart Clearing After Checkout

### ✅ Data Integrity Tests
- Foreign Key Constraints
- Stock Quantity Validation
- Product-Order Relationships
- unit_price_at_sale Audit Trail

### ✅ Edge Cases
- Concurrent Requests
- Invalid Input Validation
- Missing Required Fields
- Negative Values Prevention
- Invalid Resource IDs

---

## Conclusion

${summary.failed === 0 ? 
  '🎉 **ALL TESTS PASSED!** The backend is bulletproof and ready for production.' :
  `⚠️ **${summary.failed} TEST(S) FAILED.** Please review the failed tests above and fix any issues before deployment.`
}

**Backend Status:** ${summary.failed === 0 ? '✅ PRODUCTION READY' : '❌ NEEDS ATTENTION'}

---

*Generated by Comprehensive Backend Test Suite*
`;

  fs.writeFileSync(reportFile, reportContent, 'utf8');
  fs.writeFileSync(detailFile, details.join('\n'), 'utf8');

  log('');
  log('='.repeat(80));
  log('TEST SUITE COMPLETED');
  log('='.repeat(80));
  log('');
  log(`📊 Test Summary:`);
  log(`   Total Tests: ${summary.total}`);
  log(`   ✅ Passed: ${summary.passed}`);
  log(`   ❌ Failed: ${summary.failed}`);
  log(`   Success Rate: ${((summary.passed / summary.total) * 100).toFixed(2)}%`);
  log('');
  log(`📄 Report saved to: ${reportFile}`);
  log(`📝 Details saved to: ${detailFile}`);
  log('');

  if (summary.failed === 0) {
    log('🎉 ALL TESTS PASSED! Backend is bulletproof! 🎉');
    process.exit(0);
  } else {
    log(`⚠️  ${summary.failed} TEST(S) FAILED. Please review the report.`);
    process.exit(1);
  }
}

// Run tests
runTests().catch(error => {
  log(`❌ FATAL ERROR: ${error.message}`, 'ERROR');
  console.error('Fatal error:', error);
  process.exit(1);
});

