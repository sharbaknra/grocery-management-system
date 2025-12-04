// Home/Landing page
import { registerHomePage } from "./home/homePage.js";

// Auth pages
import { registerLoginPage } from "./auth/loginPage.js";
import { registerRegisterPage } from "./auth/registerPage.js";

// Role-based Dashboards
import { registerManagerDashboard } from "./manager/managerDashboard.js";
import { registerPosPage } from "./cashier/posPage.js";
import { registerPurchasingDashboard } from "./purchasing/purchasingDashboard.js";

// Products
import { registerProductsListPage } from "./products/listPage.js";
import { registerProductDetailPage } from "./products/detailPage.js";
import { registerProductFormPage } from "./products/formPage.js";

// Stock
import { registerStockLevelsPage } from "./stock/levelsPage.js";

// Cart & Checkout (used by POS)
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

// Billing (Module 2.8.5)
import { registerBillingPage } from "./billing/billingPage.js";
import { registerInvoiceDetailPage } from "./billing/invoiceDetailPage.js";

// Settings
import { registerSettingsPage } from "./settings/settingsPage.js";

// Staff Management
import { registerStaffListPage } from "./staff/listPage.js";
import { registerStaffFormPage } from "./staff/formPage.js";
import { registerStaffDetailPage } from "./staff/detailPage.js";

/**
 * Register all page modules with the router
 */
export function registerPages(register) {
  // Home
  registerHomePage(register);

  // Auth
  registerLoginPage(register);
  registerRegisterPage(register);

  // Role-based Dashboards
  registerManagerDashboard(register);     // manager-dashboard
  registerPosPage(register);               // pos (for cashiers)
  registerPurchasingDashboard(register);   // purchasing-dashboard

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

  // Billing (Module 2.8.5)
  registerBillingPage(register);
  registerInvoiceDetailPage(register);

  // Settings
  registerSettingsPage(register);

  // Staff Management
  registerStaffListPage(register);
  registerStaffFormPage(register);
  registerStaffDetailPage(register);
}
