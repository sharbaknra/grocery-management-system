const Reports = require("../models/reportsModel");
const { convertToCSV, generatePDF } = require("../utils/exportUtils");

const reportsController = {
  /**
   * GET /api/reports/sales/summary
   * Returns aggregated sales data for today, this week, and this month
   * Module 2.10.1 - Sales Reports
   */
  getSalesSummary: async (req, res) => {
    try {
      const summary = await Reports.getSalesSummary();

      res.status(200).json({
        success: true,
        data: summary,
      });
    } catch (error) {
      console.error("Error fetching sales summary:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch sales summary",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  /**
   * GET /api/reports/sales/daily?days=7
   * Returns daily sales trends for the last N days
   * Module 2.10.1 - Sales Reports
   */
  getDailySalesTrends: async (req, res) => {
    try {
      const days = parseInt(req.query.days) || 7;

      // Validate days parameter
      if (days < 1 || days > 365) {
        return res.status(400).json({
          success: false,
          message: "Days parameter must be between 1 and 365",
        });
      }

      const trends = await Reports.getDailySalesTrends(days);

      res.status(200).json({
        success: true,
        data: {
          period: `${days} days`,
          trends: trends,
        },
      });
    } catch (error) {
      console.error("Error fetching daily sales trends:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch daily sales trends",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  /**
   * GET /api/reports/sales/weekly
   * Returns weekly sales trends grouped by day of week
   * Module 2.10.1 - Sales Reports
   */
  getWeeklySalesTrends: async (req, res) => {
    try {
      const trends = await Reports.getWeeklySalesTrends();

      res.status(200).json({
        success: true,
        data: {
          period: "Last 30 days",
          trends: trends,
        },
      });
    } catch (error) {
      console.error("Error fetching weekly sales trends:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch weekly sales trends",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  /**
   * GET /api/reports/sales/monthly?months=6
   * Returns monthly sales trends for the last N months
   * Module 2.10.1 - Sales Reports
   */
  getMonthlySalesTrends: async (req, res) => {
    try {
      const months = parseInt(req.query.months) || 6;

      // Validate months parameter
      if (months < 1 || months > 24) {
        return res.status(400).json({
          success: false,
          message: "Months parameter must be between 1 and 24",
        });
      }

      const trends = await Reports.getMonthlySalesTrends(months);

      res.status(200).json({
        success: true,
        data: {
          period: `${months} months`,
          trends: trends,
        },
      });
    } catch (error) {
      console.error("Error fetching monthly sales trends:", error);
      console.error("Error stack:", error.stack);
      res.status(500).json({
        success: false,
        message: "Failed to fetch monthly sales trends",
        error: error.message || "Unknown error",
        ...(process.env.NODE_ENV === "development" && { 
          stack: error.stack,
          details: error.toString()
        }),
      });
    }
  },

  /**
   * GET /api/reports/inventory/low-stock
   * Returns products with low stock (quantity <= min_stock_level)
   * Module 2.10.2 - Inventory Reports
   */
  getLowStock: async (req, res) => {
    try {
      const lowStockItems = await Reports.getLowStock();

      res.status(200).json({
        success: true,
        data: {
          items: lowStockItems,
          count: lowStockItems.length,
        },
      });
    } catch (error) {
      console.error("Error fetching low stock items:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch low stock items",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  /**
   * GET /api/reports/inventory/out-of-stock
   * Returns products that are out of stock (quantity = 0)
   * Module 2.10.2 - Inventory Reports
   */
  getOutOfStock: async (req, res) => {
    try {
      const outOfStockItems = await Reports.getOutOfStock();

      res.status(200).json({
        success: true,
        data: {
          items: outOfStockItems,
          count: outOfStockItems.length,
        },
      });
    } catch (error) {
      console.error("Error fetching out of stock items:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch out of stock items",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  /**
   * GET /api/reports/inventory/expiring?days=60
   * Returns products expiring within the next N days (default: 60)
   * Module 2.10.2 - Inventory Reports
   */
  getExpiringProducts: async (req, res) => {
    try {
      const days = parseInt(req.query.days) || 60;

      // Validate days parameter
      if (days < 1 || days > 365) {
        return res.status(400).json({
          success: false,
          message: "Days parameter must be between 1 and 365",
        });
      }

      const expiringProducts = await Reports.getExpiringProducts(days);

      res.status(200).json({
        success: true,
        data: {
          period: `${days} days`,
          items: expiringProducts,
          count: expiringProducts.length,
        },
      });
    } catch (error) {
      console.error("Error fetching expiring products:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch expiring products",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  /**
   * GET /api/reports/inventory/valuation
   * Returns total inventory valuation
   * Module 2.10.2 - Inventory Reports
   */
  getInventoryValuation: async (req, res) => {
    try {
      const valuation = await Reports.getInventoryValuation();

      res.status(200).json({
        success: true,
        data: valuation,
      });
    } catch (error) {
      console.error("Error fetching inventory valuation:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch inventory valuation",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  /**
   * GET /api/reports/products/top-selling?limit=10
   * Returns top selling products by volume
   * Module 2.10.3 - Product Performance
   */
  getTopSelling: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;

      // Validate limit parameter
      if (limit < 1 || limit > 100) {
        return res.status(400).json({
          success: false,
          message: "Limit parameter must be between 1 and 100",
        });
      }

      const topSelling = await Reports.getTopSelling(limit);

      res.status(200).json({
        success: true,
        data: {
          limit: limit,
          products: topSelling,
          count: topSelling.length,
        },
      });
    } catch (error) {
      console.error("Error fetching top selling products:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch top selling products",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  /**
   * GET /api/reports/products/dead
   * Returns dead stock / slow stock (products in stock but not sold in 30 days)
   * Module 2.10.3 - Product Performance
   */
  getDeadStock: async (req, res) => {
    try {
      const deadStock = await Reports.getDeadStock();

      res.status(200).json({
        success: true,
        data: {
          items: deadStock,
          count: deadStock.length,
          total_sitting_capital: deadStock.reduce((sum, item) => sum + item.sitting_capital, 0),
        },
      });
    } catch (error) {
      console.error("Error fetching dead stock:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch dead stock",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  /**
   * GET /api/reports/products/category-sales
   * Returns category sales breakdown
   * Module 2.10.3 - Product Performance
   */
  getCategorySales: async (req, res) => {
    try {
      const categorySales = await Reports.getCategorySales();

      res.status(200).json({
        success: true,
        data: {
          categories: categorySales,
          count: categorySales.length,
          total_revenue: categorySales.reduce((sum, cat) => sum + cat.total_revenue, 0),
        },
      });
    } catch (error) {
      console.error("Error fetching category sales:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch category sales",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  /**
   * GET /api/reports/export/csv?type=sales-daily
   * Exports report data as CSV file
   * Module 2.10.4 - Exporting Reports
   */
  exportCSV: async (req, res) => {
    try {
      const reportType = req.query.type;
      if (!reportType) {
        return res.status(400).json({
          success: false,
          message: "Report type parameter is required",
        });
      }

      // Fetch data based on report type
      let data = [];
      let columns = [];
      let filename = 'report';

      switch (reportType) {
        case 'sales-daily': {
          const days = parseInt(req.query.days) || 7;
          const trends = await Reports.getDailySalesTrends(days);
          data = trends;
          columns = [
            { key: 'date', header: 'Date' },
            { key: 'revenue', header: 'Revenue' },
            { key: 'orders', header: 'Orders' },
            { key: 'items_sold', header: 'Items Sold' },
          ];
          filename = `sales-daily-${days}days-${new Date().toISOString().split('T')[0]}.csv`;
          break;
        }
        case 'sales-weekly': {
          const trends = await Reports.getWeeklySalesTrends();
          data = trends;
          columns = [
            { key: 'day_name', header: 'Day' },
            { key: 'revenue', header: 'Revenue' },
            { key: 'orders', header: 'Orders' },
            { key: 'items_sold', header: 'Items Sold' },
          ];
          filename = `sales-weekly-${new Date().toISOString().split('T')[0]}.csv`;
          break;
        }
        case 'sales-monthly': {
          const months = parseInt(req.query.months) || 6;
          const trends = await Reports.getMonthlySalesTrends(months);
          data = trends;
          columns = [
            { key: 'month', header: 'Month' },
            { key: 'revenue', header: 'Revenue' },
            { key: 'orders', header: 'Orders' },
            { key: 'items_sold', header: 'Items Sold' },
          ];
          filename = `sales-monthly-${months}months-${new Date().toISOString().split('T')[0]}.csv`;
          break;
        }
        case 'low-stock': {
          const items = await Reports.getLowStock();
          data = items;
          columns = [
            { key: 'name', header: 'Product Name' },
            { key: 'category', header: 'Category' },
            { key: 'quantity', header: 'Current Quantity' },
            { key: 'min_stock_level', header: 'Min Stock Level' },
            { key: 'shortage', header: 'Shortage' },
            { key: 'price', header: 'Price' },
          ];
          filename = `low-stock-${new Date().toISOString().split('T')[0]}.csv`;
          break;
        }
        case 'out-of-stock': {
          const items = await Reports.getOutOfStock();
          data = items;
          columns = [
            { key: 'name', header: 'Product Name' },
            { key: 'category', header: 'Category' },
            { key: 'quantity', header: 'Quantity' },
            { key: 'min_stock_level', header: 'Min Stock Level' },
            { key: 'price', header: 'Price' },
          ];
          filename = `out-of-stock-${new Date().toISOString().split('T')[0]}.csv`;
          break;
        }
        case 'expiring': {
          const days = parseInt(req.query.days) || 60;
          const items = await Reports.getExpiringProducts(days);
          data = items;
          columns = [
            { key: 'name', header: 'Product Name' },
            { key: 'category', header: 'Category' },
            { key: 'expiry_date', header: 'Expiry Date' },
            { key: 'days_until_expiry', header: 'Days Until Expiry' },
            { key: 'quantity', header: 'Quantity' },
            { key: 'price', header: 'Price' },
          ];
          filename = `expiring-products-${days}days-${new Date().toISOString().split('T')[0]}.csv`;
          break;
        }
        case 'valuation': {
          const valuation = await Reports.getInventoryValuation();
          data = [valuation];
          columns = [
            { key: 'total_value', header: 'Total Value' },
            { key: 'total_products', header: 'Total Products' },
            { key: 'products_in_stock', header: 'Products In Stock' },
            { key: 'total_units', header: 'Total Units' },
          ];
          filename = `inventory-valuation-${new Date().toISOString().split('T')[0]}.csv`;
          break;
        }
        case 'top-selling': {
          const limit = parseInt(req.query.limit) || 10;
          const products = await Reports.getTopSelling(limit);
          data = products;
          columns = [
            { key: 'name', header: 'Product Name' },
            { key: 'category', header: 'Category' },
            { key: 'total_quantity_sold', header: 'Quantity Sold' },
            { key: 'order_count', header: 'Order Count' },
            { key: 'total_revenue', header: 'Total Revenue' },
            { key: 'price', header: 'Current Price' },
          ];
          filename = `top-selling-${limit}-${new Date().toISOString().split('T')[0]}.csv`;
          break;
        }
        case 'dead-stock': {
          const items = await Reports.getDeadStock();
          data = items;
          columns = [
            { key: 'name', header: 'Product Name' },
            { key: 'category', header: 'Category' },
            { key: 'quantity', header: 'Quantity' },
            { key: 'price', header: 'Price' },
            { key: 'sitting_capital', header: 'Sitting Capital' },
          ];
          filename = `dead-stock-${new Date().toISOString().split('T')[0]}.csv`;
          break;
        }
        case 'category-sales': {
          const categories = await Reports.getCategorySales();
          data = categories;
          columns = [
            { key: 'category', header: 'Category' },
            { key: 'total_revenue', header: 'Total Revenue' },
            { key: 'total_quantity_sold', header: 'Quantity Sold' },
            { key: 'order_count', header: 'Order Count' },
            { key: 'product_count', header: 'Product Count' },
          ];
          filename = `category-sales-${new Date().toISOString().split('T')[0]}.csv`;
          break;
        }
        default:
          return res.status(400).json({
            success: false,
            message: `Invalid report type: ${reportType}. Supported types: sales-daily, sales-weekly, sales-monthly, low-stock, out-of-stock, expiring, valuation, top-selling, dead-stock, category-sales`,
          });
      }

      // Generate CSV
      const csvContent = convertToCSV(data, columns);

      // Set response headers for file download
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.status(200).send(csvContent);
    } catch (error) {
      console.error("Error exporting CSV:", error);
      res.status(500).json({
        success: false,
        message: "Failed to export CSV",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  /**
   * GET /api/reports/export/pdf?type=low-stock
   * Exports report data as PDF file
   * Module 2.10.4 - Exporting Reports
   */
  exportPDF: async (req, res) => {
    try {
      const reportType = req.query.type;
      if (!reportType) {
        return res.status(400).json({
          success: false,
          message: "Report type parameter is required",
        });
      }

      // Fetch data based on report type
      let data = [];
      let columns = [];
      let title = 'Report';
      let filename = 'report';

      switch (reportType) {
        case 'sales-daily': {
          const days = parseInt(req.query.days) || 7;
          const trends = await Reports.getDailySalesTrends(days);
          data = trends;
          columns = [
            { key: 'date', header: 'Date' },
            { key: 'revenue', header: 'Revenue' },
            { key: 'orders', header: 'Orders' },
            { key: 'items_sold', header: 'Items Sold' },
          ];
          title = `Daily Sales Report (Last ${days} Days)`;
          filename = `sales-daily-${days}days-${new Date().toISOString().split('T')[0]}.pdf`;
          break;
        }
        case 'sales-weekly': {
          const trends = await Reports.getWeeklySalesTrends();
          data = trends;
          columns = [
            { key: 'day_name', header: 'Day' },
            { key: 'revenue', header: 'Revenue' },
            { key: 'orders', header: 'Orders' },
            { key: 'items_sold', header: 'Items Sold' },
          ];
          title = 'Weekly Sales Report (Last 30 Days)';
          filename = `sales-weekly-${new Date().toISOString().split('T')[0]}.pdf`;
          break;
        }
        case 'sales-monthly': {
          const months = parseInt(req.query.months) || 6;
          const trends = await Reports.getMonthlySalesTrends(months);
          data = trends;
          columns = [
            { key: 'month', header: 'Month' },
            { key: 'revenue', header: 'Revenue' },
            { key: 'orders', header: 'Orders' },
            { key: 'items_sold', header: 'Items Sold' },
          ];
          title = `Monthly Sales Report (Last ${months} Months)`;
          filename = `sales-monthly-${months}months-${new Date().toISOString().split('T')[0]}.pdf`;
          break;
        }
        case 'low-stock': {
          const items = await Reports.getLowStock();
          data = items;
          columns = [
            { key: 'name', header: 'Product Name' },
            { key: 'category', header: 'Category' },
            { key: 'quantity', header: 'Current Qty' },
            { key: 'min_stock_level', header: 'Min Level' },
            { key: 'shortage', header: 'Shortage' },
            { key: 'price', header: 'Price' },
          ];
          title = 'Low Stock Report';
          filename = `low-stock-${new Date().toISOString().split('T')[0]}.pdf`;
          break;
        }
        case 'out-of-stock': {
          const items = await Reports.getOutOfStock();
          data = items;
          columns = [
            { key: 'name', header: 'Product Name' },
            { key: 'category', header: 'Category' },
            { key: 'quantity', header: 'Quantity' },
            { key: 'min_stock_level', header: 'Min Level' },
            { key: 'price', header: 'Price' },
          ];
          title = 'Out of Stock Report';
          filename = `out-of-stock-${new Date().toISOString().split('T')[0]}.pdf`;
          break;
        }
        case 'expiring': {
          const days = parseInt(req.query.days) || 60;
          const items = await Reports.getExpiringProducts(days);
          data = items;
          columns = [
            { key: 'name', header: 'Product Name' },
            { key: 'category', header: 'Category' },
            { key: 'expiry_date', header: 'Expiry Date' },
            { key: 'days_until_expiry', header: 'Days Left' },
            { key: 'quantity', header: 'Quantity' },
            { key: 'price', header: 'Price' },
          ];
          title = `Expiring Products Report (Next ${days} Days)`;
          filename = `expiring-products-${days}days-${new Date().toISOString().split('T')[0]}.pdf`;
          break;
        }
        case 'valuation': {
          const valuation = await Reports.getInventoryValuation();
          data = [valuation];
          columns = [
            { key: 'total_value', header: 'Total Value' },
            { key: 'total_products', header: 'Total Products' },
            { key: 'products_in_stock', header: 'In Stock' },
            { key: 'total_units', header: 'Total Units' },
          ];
          title = 'Inventory Valuation Report';
          filename = `inventory-valuation-${new Date().toISOString().split('T')[0]}.pdf`;
          break;
        }
        case 'top-selling': {
          const limit = parseInt(req.query.limit) || 10;
          const products = await Reports.getTopSelling(limit);
          data = products;
          columns = [
            { key: 'name', header: 'Product Name' },
            { key: 'category', header: 'Category' },
            { key: 'total_quantity_sold', header: 'Qty Sold' },
            { key: 'order_count', header: 'Orders' },
            { key: 'total_revenue', header: 'Revenue' },
            { key: 'price', header: 'Price' },
          ];
          title = `Top Selling Products (Top ${limit})`;
          filename = `top-selling-${limit}-${new Date().toISOString().split('T')[0]}.pdf`;
          break;
        }
        case 'dead-stock': {
          const items = await Reports.getDeadStock();
          data = items;
          columns = [
            { key: 'name', header: 'Product Name' },
            { key: 'category', header: 'Category' },
            { key: 'quantity', header: 'Quantity' },
            { key: 'price', header: 'Price' },
            { key: 'sitting_capital', header: 'Sitting Capital' },
          ];
          title = 'Dead Stock Report (Not Sold in 30 Days)';
          filename = `dead-stock-${new Date().toISOString().split('T')[0]}.pdf`;
          break;
        }
        case 'category-sales': {
          const categories = await Reports.getCategorySales();
          data = categories;
          columns = [
            { key: 'category', header: 'Category' },
            { key: 'total_revenue', header: 'Revenue' },
            { key: 'total_quantity_sold', header: 'Qty Sold' },
            { key: 'order_count', header: 'Orders' },
            { key: 'product_count', header: 'Products' },
          ];
          title = 'Category Sales Breakdown';
          filename = `category-sales-${new Date().toISOString().split('T')[0]}.pdf`;
          break;
        }
        default:
          return res.status(400).json({
            success: false,
            message: `Invalid report type: ${reportType}. Supported types: sales-daily, sales-weekly, sales-monthly, low-stock, out-of-stock, expiring, valuation, top-selling, dead-stock, category-sales`,
          });
      }

      // Generate PDF
      const pdfBuffer = await generatePDF(data, { title, columns, filename });

      // Set response headers for file download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.status(200).send(pdfBuffer);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      res.status(500).json({
        success: false,
        message: "Failed to export PDF",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
};

module.exports = reportsController;

