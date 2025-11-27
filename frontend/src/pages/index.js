// Auth pages
import { registerLoginPage } from "./auth/loginPage.js";
import { registerRegisterPage } from "./auth/registerPage.js";

// Dashboard
import { registerDashboardPage } from "./dashboard/overviewPage.js";

// Products
import { registerProductsListPage } from "./products/listPage.js";
import { registerProductDetailPage } from "./products/detailPage.js";
import { registerProductFormPage } from "./products/formPage.js";

// Stock
import { registerStockLevelsPage } from "./stock/levelsPage.js";

// Cart & Checkout
import { registerCartPage } from "./cart/cartPage.js";
import { registerCheckoutPage } from "./checkout/checkoutPage.js";

// Suppliers
import { registerSuppliersListPage } from "./suppliers/listPage.js";
import { registerSupplierDetailPage } from "./suppliers/detailPage.js";
import { registerSupplierFormPage } from "./suppliers/formPage.js";
import { registerReorderDashboardPage } from "./suppliers/reorderPage.js";

// Orders
import { registerOrdersHistoryPage } from "./orders/historyPage.js";
import { registerOrderDetailPage } from "./orders/detailPage.js";

// Reports
import { registerReportsPage } from "./reports/reportsPage.js";

// Settings
import { registerSettingsPage } from "./settings/settingsPage.js";

/**
 * Register all page modules with the router
 */
export function registerPages(register) {
  // Auth
  registerLoginPage(register);
  registerRegisterPage(register);

  // Dashboard
  registerDashboardPage(register);

  // Products
  registerProductsListPage(register);
  registerProductDetailPage(register);
  registerProductFormPage(register);

  // Stock
  registerStockLevelsPage(register);

  // Cart & Checkout
  registerCartPage(register);
  registerCheckoutPage(register);

  // Suppliers
  registerSuppliersListPage(register);
  registerSupplierDetailPage(register);
  registerSupplierFormPage(register);
  registerReorderDashboardPage(register);

  // Orders
  registerOrdersHistoryPage(register);
  registerOrderDetailPage(register);

  // Reports
  registerReportsPage(register);

  // Settings
  registerSettingsPage(register);
}
