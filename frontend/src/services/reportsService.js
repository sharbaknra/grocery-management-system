import { apiClient } from "./apiClient.js";

export const reportsService = {
  getSalesSummary() {
    return apiClient.get("/reports/sales/summary");
  },
  getDailySales(params) {
    return apiClient.get("/reports/sales/daily", { query: params });
  },
  getWeeklySales() {
    return apiClient.get("/reports/sales/weekly");
  },
  getMonthlySales(params) {
    return apiClient.get("/reports/sales/monthly", { query: params });
  },
  getLowStock() {
    return apiClient.get("/reports/inventory/low-stock");
  },
  getOutOfStock() {
    return apiClient.get("/reports/inventory/out-of-stock");
  },
  getExpiring(params) {
    return apiClient.get("/reports/inventory/expiring", { query: params });
  },
  getInventoryValuation() {
    return apiClient.get("/reports/inventory/valuation");
  },
  getTopSelling(params) {
    return apiClient.get("/reports/products/top-selling", { query: params });
  },
  getDeadStock() {
    return apiClient.get("/reports/products/dead");
  },
  getCategorySales() {
    return apiClient.get("/reports/products/category-sales");
  },
  exportCsv(type) {
    return apiClient.get("/reports/export/csv", { query: { type } });
  },
  exportPdf(type) {
    return apiClient.get("/reports/export/pdf", { query: { type } });
  },
};

