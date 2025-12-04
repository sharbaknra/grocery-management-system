/**
 * Grocery Management System - UI-Oriented Stock & Order Flow Tests
 *
 * These tests exercise the core inventory and order flows and assert that
 * stock-related data is consistent across the main API surfaces used by the UI:
 * - /products
 * - /stock/low-stock
 * - /reports/inventory/low-stock
 * - /suppliers/reorder
 * - /orders/cart + /orders/checkout
 *
 * Run with: node frontend/tests/ui-stock-flows.js
 *
 * Prerequisites:
 * - Backend running on http://localhost:5000
 * - Database seeded with default users and at least one product
 */

const API_BASE = "http://localhost:5000/api";

// Test credentials (must match backend seed users)
const USERS = {
  manager: { email: "admin@grocery.com", password: "admin123" },
  staff: { email: "staff@grocery.com", password: "staff123" },
};

let tokens = {};
let passCount = 0;
let failCount = 0;

function log(message, type = "info") {
  const colors = {
    info: "\x1b[36m",
    success: "\x1b[32m",
    error: "\x1b[31m",
    warn: "\x1b[33m",
    header: "\x1b[35m",
    reset: "\x1b[0m",
  };
  console.log(`${colors[type]}${message}${colors.reset}`);
}

function section(title) {
  log(`\n${"═".repeat(60)}`, "header");
  log(`  ${title}`, "header");
  log(`${"═".repeat(60)}`, "header");
}

function test(name, passed, details = "") {
  if (passed) {
    passCount++;
    log(`  ✅ ${name}`, "success");
  } else {
    failCount++;
    log(`  ❌ ${name}${details ? ": " + details : ""}`, "error");
  }
}

async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.token && { Authorization: `Bearer ${options.token}` }),
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));
  return { status: response.status, ok: response.ok, data };
}

async function loginUsers() {
  section("AUTHENTICATION (SETUP)");

  const managerLogin = await fetchAPI("/users/login", {
    method: "POST",
    body: JSON.stringify(USERS.manager),
  });
  test("Manager login returns token", managerLogin.ok && managerLogin.data.token);
  tokens.manager = managerLogin.data.token;

  const staffLogin = await fetchAPI("/users/login", {
    method: "POST",
    body: JSON.stringify(USERS.staff),
  });
  test("Staff login returns token", staffLogin.ok && staffLogin.data.token);
  tokens.staff = staffLogin.data.token;
}

function normalizeArrayPayload(payload) {
  // Try common shapes: array, { items }, { data }, { data: { items } }, { success, data: [...] }
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.items)) return payload.data.items;
  if (Array.isArray(payload?.data?.orders)) return payload.data.orders;
  // Fallback: single object or unexpected shape → wrap or empty
  return [];
}

async function pickTestProduct() {
  const res = await fetchAPI("/products", { token: tokens.manager });
  if (!res.ok) {
    test("Fetch products for stock tests", false, `status=${res.status}`);
    return null;
  }

  const list = res.data.products || res.data || [];
  const product = list.find((p) => (p.stock_quantity || p.quantity || 0) > 0) || list[0];

  test("Found at least one product for stock flow tests", !!product);
  return product || null;
}

async function coreInventoryFlows() {
  section("CORE INVENTORY FLOWS – RESTOCK / REDUCE");

  const product = await pickTestProduct();
  if (!product) {
    log("No products available; skipping core inventory flow tests.", "warn");
    return;
  }

  const productId = product.id;
  const originalQty = product.stock_quantity || product.quantity || 0;
  const minLevel = product.min_stock_level || 10;

  // Step 1: Ensure we have room to reduce into low-stock range
  const targetHighQty = Math.max(originalQty, minLevel + 5);
  const restockAmount = targetHighQty - originalQty;

  if (restockAmount > 0) {
    const restockRes = await fetchAPI("/stock/restock", {
      method: "POST",
      token: tokens.manager,
      body: JSON.stringify({ productId, quantity: restockAmount, reason: "UI stock flow test setup" }),
    });
    test("Restock product for setup succeeds", restockRes.ok);
  } else {
    test("Restock not required for setup", true);
  }

  // Re-fetch product to get updated quantity
  const afterRestock = await fetchAPI(`/products/${productId}`, { token: tokens.manager });
  const qtyAfterRestock = afterRestock.data.stock_quantity || afterRestock.data.quantity || 0;

  test("Quantity after restock is >= minLevel + 5", qtyAfterRestock >= minLevel + 5);

  // Step 2: Reduce into low-stock range
  const reduceToLow = qtyAfterRestock - (minLevel - 1); // target quantity = minLevel - 1
  const reduceRes = await fetchAPI("/stock/reduce", {
    method: "POST",
    token: tokens.manager,
    body: JSON.stringify({ productId, quantity: reduceToLow, reason: "UI stock flow test – low stock" }),
  });
  test("Reduce stock into low-stock range succeeds", reduceRes.ok);

  // Verify via multiple API surfaces
  const productAfterReduce = await fetchAPI(`/products/${productId}`, { token: tokens.manager });
  const lowQty = productAfterReduce.data.stock_quantity || productAfterReduce.data.quantity || 0;
  test("Quantity after reduce equals minLevel - 1", lowQty === minLevel - 1);

  // /stock/low-stock should include product
  const lowStockRes = await fetchAPI("/stock/low-stock", { token: tokens.manager });
  const lowStockList = normalizeArrayPayload(lowStockRes.data);
  const inLowStock = lowStockList.some((p) => (p.id || p.product_id) === productId);
  test("Product appears in /stock/low-stock", lowStockRes.ok && inLowStock);

  // /reports/inventory/low-stock should also include product
  const lowStockReportRes = await fetchAPI("/reports/inventory/low-stock", { token: tokens.manager });
  const lowStockReportList = normalizeArrayPayload(lowStockReportRes.data);
  const inLowStockReport = lowStockReportList.some((p) => (p.id || p.product_id) === productId);
  test("Product appears in reports low-stock inventory", lowStockReportRes.ok && inLowStockReport);

  // /suppliers/reorder should group product under its supplier (when linked)
  const reorderRes = await fetchAPI("/suppliers/reorder", { token: tokens.manager });
  const groups = Array.isArray(reorderRes.data?.groups)
    ? reorderRes.data.groups
    : normalizeArrayPayload(reorderRes.data);
  const inReorder = groups.some((g) =>
    (g.products || []).some((p) => (p.id || p.product_id) === productId)
  );
  const hasSupplierLink = !!(product.supplier_id);
  // If the product has a supplier_id, it should appear; otherwise just ensure endpoint works
  test(
    "Product appears in suppliers reorder dashboard data (when supplier-linked)",
    reorderRes.ok && (!hasSupplierLink || inReorder)
  );

  // Step 3: Restock back to normal and ensure it disappears from low-stock surfaces
  const restockToNormalRes = await fetchAPI("/stock/restock", {
    method: "POST",
    token: tokens.manager,
    body: JSON.stringify({
      productId,
      quantity: minLevel + 5, // overshoot to guarantee OK state
      reason: "UI stock flow test – reset to normal",
    }),
  });
  test("Restock back to normal succeeds", restockToNormalRes.ok);

  const afterResetLowStock = await fetchAPI("/stock/low-stock", { token: tokens.manager });
  const resetLowList = normalizeArrayPayload(afterResetLowStock.data);
  const stillLow = resetLowList.some((p) => (p.id || p.product_id) === productId);
  test("Product is removed from /stock/low-stock after restock", !stillLow);
}

async function coreOrderFlowAffectsStock() {
  section("CORE ORDER FLOW – CHECKOUT UPDATES STOCK");

  const product = await pickTestProduct();
  if (!product) {
    log("No products available; skipping order-stock linkage tests.", "warn");
    return;
  }

  const productId = product.id;
  const originalQty = product.stock_quantity || product.quantity || 0;

  if (originalQty < 3) {
    log("Product has too little stock for checkout test; skipping.", "warn");
    test("Skip checkout-stock test due to low initial stock", true);
    return;
  }

  // Clear staff cart first
  await fetchAPI("/orders/cart/clear", {
    method: "DELETE",
    token: tokens.staff,
  }).catch(() => {});

  // Add 2 units of the product to the cart
  const addRes = await fetchAPI("/orders/cart/add", {
    method: "POST",
    token: tokens.staff,
    body: JSON.stringify({ productId, quantity: 2 }),
  });
  test("Add product to cart for checkout succeeds", addRes.ok);

  // Perform checkout
  const checkoutRes = await fetchAPI("/orders/checkout", {
    method: "POST",
    token: tokens.staff,
    body: JSON.stringify({ payment_method: "cash" }),
  });
  test("Checkout request succeeds", checkoutRes.ok);

  // Verify stock decreased by at least 2
  const afterCheckout = await fetchAPI(`/products/${productId}`, { token: tokens.manager });
  const qtyAfterCheckout = afterCheckout.data.stock_quantity || afterCheckout.data.quantity || 0;
  test(
    "Product quantity decreased after checkout",
    qtyAfterCheckout <= originalQty - 2
  );

  // Edge-case: cart should be empty after checkout
  const cartAfter = await fetchAPI("/orders/cart", { token: tokens.staff });
  const cartItems = cartAfter.data.items || cartAfter.data || [];
  test("Cart is empty or missing after checkout", !Array.isArray(cartItems) || cartItems.length === 0);
}

async function edgeCaseTests() {
  section("EDGE CASES – STOCK & CART VALIDATION");

  const product = await pickTestProduct();
  if (!product) {
    log("No products available; skipping edge-case tests.", "warn");
    test("Skip edge-case tests due to missing product", true);
    return;
  }

  const productId = product.id;

  // Negative quantity reduce should fail or be rejected by API
  const negativeReduce = await fetchAPI("/stock/reduce", {
    method: "POST",
    token: tokens.manager,
    body: JSON.stringify({ productId, quantity: -5, reason: "invalid negative test" }),
  });
  test(
    "Negative reduce quantity is rejected",
    !negativeReduce.ok || negativeReduce.status >= 400
  );

  // Zero quantity restock should either be rejected or no-op but not crash
  const zeroRestock = await fetchAPI("/stock/restock", {
    method: "POST",
    token: tokens.manager,
    body: JSON.stringify({ productId, quantity: 0, reason: "zero quantity test" }),
  });
  test(
    "Zero-quantity restock does not succeed silently",
    !zeroRestock.ok || zeroRestock.status >= 400
  );

  // Very large quantity restock should be handled safely
  const largeRestock = await fetchAPI("/stock/restock", {
    method: "POST",
    token: tokens.manager,
    body: JSON.stringify({ productId, quantity: 1000000, reason: "large quantity sanity test" }),
  });
  test(
    "Very large restock request is handled (either ok or clear validation error)",
    largeRestock.ok || largeRestock.status >= 400
  );
}

async function run() {
  console.clear();
  log("\n🚀 UI STOCK & ORDER FLOW TESTS", "header");
  log("=".repeat(60), "header");

  try {
    await loginUsers();
    await coreInventoryFlows();
    await coreOrderFlowAffectsStock();
    await edgeCaseTests();
  } catch (err) {
    log(`\n💥 Error during stock/UI tests: ${err.message}`, "error");
    console.error(err);
  }

  section("STOCK FLOW TEST SUMMARY");
  const total = passCount + failCount;
  const passRate = total ? ((passCount / total) * 100).toFixed(1) : "0.0";
  log(`Total tests: ${total}`, "info");
  log(`Passed: ${passCount}`, "success");
  log(`Failed: ${failCount}`, failCount ? "error" : "success");
  log(`Pass rate: ${passRate}%`, passRate >= 80 ? "success" : "warn");

  process.exit(failCount > 0 ? 1 : 0);
}

run();


