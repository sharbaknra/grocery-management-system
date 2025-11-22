const express = require("express");
const router = express.Router();

const reportsController = require("../controllers/reportsController");
const verifyToken = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

// Sales Reports (Module 2.10.1)
// All reports endpoints are restricted to Admin and Staff only

// GET /api/reports/sales/summary - Get aggregated sales summary (today, week, month)
router.get(
  "/sales/summary",
  verifyToken,
  allowRoles("admin", "staff"),
  reportsController.getSalesSummary
);

// GET /api/reports/sales/daily?days=7 - Get daily sales trends
router.get(
  "/sales/daily",
  verifyToken,
  allowRoles("admin", "staff"),
  reportsController.getDailySalesTrends
);

// GET /api/reports/sales/weekly - Get weekly sales trends (grouped by day of week)
router.get(
  "/sales/weekly",
  verifyToken,
  allowRoles("admin", "staff"),
  reportsController.getWeeklySalesTrends
);

// GET /api/reports/sales/monthly?months=6 - Get monthly sales trends
router.get(
  "/sales/monthly",
  verifyToken,
  allowRoles("admin", "staff"),
  reportsController.getMonthlySalesTrends
);

// Inventory Reports (Module 2.10.2)
// All inventory report endpoints are restricted to Admin and Staff only

// GET /api/reports/inventory/low-stock - Get low stock items
router.get(
  "/inventory/low-stock",
  verifyToken,
  allowRoles("admin", "staff"),
  reportsController.getLowStock
);

// GET /api/reports/inventory/out-of-stock - Get out of stock items
router.get(
  "/inventory/out-of-stock",
  verifyToken,
  allowRoles("admin", "staff"),
  reportsController.getOutOfStock
);

// GET /api/reports/inventory/expiring?days=60 - Get expiring products
router.get(
  "/inventory/expiring",
  verifyToken,
  allowRoles("admin", "staff"),
  reportsController.getExpiringProducts
);

// GET /api/reports/inventory/valuation - Get inventory valuation
router.get(
  "/inventory/valuation",
  verifyToken,
  allowRoles("admin", "staff"),
  reportsController.getInventoryValuation
);

// Product Performance Reports (Module 2.10.3)
// All product performance endpoints are restricted to Admin and Staff only

// GET /api/reports/products/top-selling?limit=10 - Get top selling products by volume
router.get(
  "/products/top-selling",
  verifyToken,
  allowRoles("admin", "staff"),
  reportsController.getTopSelling
);

// GET /api/reports/products/dead - Get dead stock (not sold in 30 days)
router.get(
  "/products/dead",
  verifyToken,
  allowRoles("admin", "staff"),
  reportsController.getDeadStock
);

// GET /api/reports/products/category-sales - Get category sales breakdown
router.get(
  "/products/category-sales",
  verifyToken,
  allowRoles("admin", "staff"),
  reportsController.getCategorySales
);

// Export Reports (Module 2.10.4)
// All export endpoints are restricted to Admin and Staff only

// GET /api/reports/export/csv?type=sales-daily - Export report as CSV
router.get(
  "/export/csv",
  verifyToken,
  allowRoles("admin", "staff"),
  reportsController.exportCSV
);

// GET /api/reports/export/pdf?type=low-stock - Export report as PDF
router.get(
  "/export/pdf",
  verifyToken,
  allowRoles("admin", "staff"),
  reportsController.exportPDF
);

module.exports = router;

