const db = require("../config/db");

const Reports = {
  /**
   * Get sales summary for today, this week, and this month
   * Uses order_items.unit_price_at_sale for historical accuracy (Module 2.10.1)
   * Only counts orders with status='Completed'
   */
  getSalesSummary: async () => {
    // Today's sales
    const todaySql = `
      SELECT 
        COALESCE(SUM(oi.quantity * oi.unit_price_at_sale), 0) AS revenue,
        COUNT(DISTINCT o.order_id) AS orders,
        COALESCE(SUM(oi.quantity), 0) AS items_sold
      FROM orders o
      INNER JOIN order_items oi ON o.order_id = oi.order_id
      WHERE o.status = 'Completed'
        AND DATE(o.created_at) = CURDATE()
    `;

    // This week's sales (from start of week to now)
    const weekSql = `
      SELECT 
        COALESCE(SUM(oi.quantity * oi.unit_price_at_sale), 0) AS revenue,
        COUNT(DISTINCT o.order_id) AS orders,
        COALESCE(SUM(oi.quantity), 0) AS items_sold
      FROM orders o
      INNER JOIN order_items oi ON o.order_id = oi.order_id
      WHERE o.status = 'Completed'
        AND YEARWEEK(o.created_at, 1) = YEARWEEK(CURDATE(), 1)
    `;

    // This month's sales
    const monthSql = `
      SELECT 
        COALESCE(SUM(oi.quantity * oi.unit_price_at_sale), 0) AS revenue,
        COUNT(DISTINCT o.order_id) AS orders,
        COALESCE(SUM(oi.quantity), 0) AS items_sold
      FROM orders o
      INNER JOIN order_items oi ON o.order_id = oi.order_id
      WHERE o.status = 'Completed'
        AND YEAR(o.created_at) = YEAR(CURDATE())
        AND MONTH(o.created_at) = MONTH(CURDATE())
    `;

    const [todayResult] = await db.promise().query(todaySql);
    const [weekResult] = await db.promise().query(weekSql);
    const [monthResult] = await db.promise().query(monthSql);

    return {
      today: {
        revenue: parseFloat(todayResult[0].revenue) || 0,
        orders: parseInt(todayResult[0].orders) || 0,
        items_sold: parseInt(todayResult[0].items_sold) || 0,
      },
      week: {
        revenue: parseFloat(weekResult[0].revenue) || 0,
        orders: parseInt(weekResult[0].orders) || 0,
        items_sold: parseInt(weekResult[0].items_sold) || 0,
      },
      month: {
        revenue: parseFloat(monthResult[0].revenue) || 0,
        orders: parseInt(monthResult[0].orders) || 0,
        items_sold: parseInt(monthResult[0].items_sold) || 0,
      },
    };
  },

  /**
   * Get daily sales trends for the last N days (default: 7 days)
   * Uses order_items.unit_price_at_sale for historical accuracy
   * Only counts orders with status='Completed'
   */
  getDailySalesTrends: async (days = 7) => {
    const sql = `
      SELECT 
        DATE(o.created_at) AS date,
        COALESCE(SUM(oi.quantity * oi.unit_price_at_sale), 0) AS revenue,
        COUNT(DISTINCT o.order_id) AS orders,
        COALESCE(SUM(oi.quantity), 0) AS items_sold
      FROM orders o
      INNER JOIN order_items oi ON o.order_id = oi.order_id
      WHERE o.status = 'Completed'
        AND DATE(o.created_at) >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      GROUP BY DATE(o.created_at)
      ORDER BY date DESC
    `;

    const [rows] = await db.promise().query(sql, [days]);
    return rows.map((row) => ({
      date: row.date,
      revenue: parseFloat(row.revenue) || 0,
      orders: parseInt(row.orders) || 0,
      items_sold: parseInt(row.items_sold) || 0,
    }));
  },

  /**
   * Get weekly sales trends grouped by day of week
   * Uses DAYNAME(created_at) for comparative analysis (Module 2.10.1)
   * Uses order_items.unit_price_at_sale for historical accuracy
   * Only counts orders with status='Completed'
   */
  getWeeklySalesTrends: async () => {
    const sql = `
      SELECT 
        DAYNAME(o.created_at) AS day_name,
        DAYOFWEEK(o.created_at) AS day_number,
        COALESCE(SUM(oi.quantity * oi.unit_price_at_sale), 0) AS revenue,
        COUNT(DISTINCT o.order_id) AS orders,
        COALESCE(SUM(oi.quantity), 0) AS items_sold
      FROM orders o
      INNER JOIN order_items oi ON o.order_id = oi.order_id
      WHERE o.status = 'Completed'
        AND o.created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      GROUP BY DAYNAME(o.created_at), DAYOFWEEK(o.created_at)
      ORDER BY day_number ASC
    `;

    const [rows] = await db.promise().query(sql);
    return rows.map((row) => ({
      day_name: row.day_name,
      day_number: parseInt(row.day_number),
      revenue: parseFloat(row.revenue) || 0,
      orders: parseInt(row.orders) || 0,
      items_sold: parseInt(row.items_sold) || 0,
    }));
  },

  /**
   * Get monthly sales trends for the last N months (default: 6 months)
   * Uses order_items.unit_price_at_sale for historical accuracy
   * Only counts orders with status='Completed'
   */
  getMonthlySalesTrends: async (months = 6) => {
    try {
      // Note: INTERVAL values cannot be parameterized in MySQL prepared statements
      // Since months is validated in the controller (1-24), it's safe to interpolate
      const sanitizedMonths = parseInt(months); // Ensure it's an integer
      
      if (isNaN(sanitizedMonths) || sanitizedMonths < 1 || sanitizedMonths > 24) {
        throw new Error(`Invalid months value: ${months}`);
      }
      
      const sql = `
        SELECT 
          DATE_FORMAT(o.created_at, '%Y-%m') AS month,
          YEAR(o.created_at) AS year,
          MONTH(o.created_at) AS month_number,
          COALESCE(SUM(oi.quantity * oi.unit_price_at_sale), 0) AS revenue,
          COUNT(DISTINCT o.order_id) AS orders,
          COALESCE(SUM(oi.quantity), 0) AS items_sold
        FROM orders o
        INNER JOIN order_items oi ON o.order_id = oi.order_id
        WHERE o.status = 'Completed'
          AND o.created_at >= DATE_SUB(CURDATE(), INTERVAL ${sanitizedMonths} MONTH)
        GROUP BY YEAR(o.created_at), MONTH(o.created_at), DATE_FORMAT(o.created_at, '%Y-%m')
        ORDER BY year DESC, month_number DESC
      `;

      console.log('Executing monthly trends query with months:', sanitizedMonths);
      const [rows] = await db.promise().query(sql);
      console.log('Query executed successfully, rows returned:', rows.length);
      
      return rows.map((row) => ({
        month: row.month,
        year: parseInt(row.year),
        month_number: parseInt(row.month_number),
        revenue: parseFloat(row.revenue) || 0,
        orders: parseInt(row.orders) || 0,
        items_sold: parseInt(row.items_sold) || 0,
      }));
    } catch (error) {
      console.error('Error in getMonthlySalesTrends:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      throw error;
    }
  },

  /**
   * Get low stock items (Module 2.10.2)
   * Returns products where quantity <= min_stock_level
   * Uses threshold from Module 2.8.1
   */
  getLowStock: async () => {
    const sql = `
      SELECT 
        p.id,
        p.name,
        p.category,
        p.price,
        p.image_url,
        s.quantity,
        s.min_stock_level,
        (s.min_stock_level - s.quantity) AS shortage,
        sup.id AS supplier_id,
        sup.name AS supplier_name,
        sup.contact_name AS supplier_contact_name,
        sup.phone AS supplier_phone,
        sup.email AS supplier_email,
        sup.lead_time_days
      FROM products p
      INNER JOIN stock s ON p.id = s.product_id
      LEFT JOIN suppliers sup ON p.supplier_id = sup.id
      WHERE s.quantity > 0
        AND s.quantity < s.min_stock_level
        AND s.min_stock_level > 0
      ORDER BY s.quantity ASC, shortage DESC
    `;
    const [rows] = await db.promise().query(sql);
    return rows.map((row) => ({
      product_id: row.id,
      name: row.name,
      category: row.category,
      price: parseFloat(row.price) || 0,
      image_url: row.image_url,
      quantity: parseInt(row.quantity) || 0,
      min_stock_level: parseInt(row.min_stock_level) || 0,
      shortage: parseInt(row.shortage) || 0,
      supplier_id: row.supplier_id,
      supplier_name: row.supplier_name,
      supplier_contact_name: row.supplier_contact_name,
      supplier_phone: row.supplier_phone,
      supplier_email: row.supplier_email,
      supplier_lead_time_days: row.lead_time_days,
    }));
  },

  /**
   * Get out of stock items (Module 2.10.2)
   * Returns products where quantity = 0
   */
  getOutOfStock: async () => {
    const sql = `
      SELECT 
        p.id,
        p.name,
        p.category,
        p.price,
        p.image_url,
        s.quantity,
        s.min_stock_level,
        sup.id AS supplier_id,
        sup.name AS supplier_name
      FROM products p
      INNER JOIN stock s ON p.id = s.product_id
      LEFT JOIN suppliers sup ON p.supplier_id = sup.id
      WHERE s.quantity = 0
      ORDER BY p.name ASC
    `;
    const [rows] = await db.promise().query(sql);
    return rows.map((row) => ({
      product_id: row.id,
      name: row.name,
      category: row.category,
      price: parseFloat(row.price) || 0,
      image_url: row.image_url,
      quantity: parseInt(row.quantity) || 0,
      min_stock_level: parseInt(row.min_stock_level) || 0,
      supplier_id: row.supplier_id,
      supplier_name: row.supplier_name,
    }));
  },

  /**
   * Get expiring products (Module 2.10.2)
   * Returns products expiring within the next N days (default: 60 days)
   * Uses robust date arithmetic with proper NULL filtering
   */
  getExpiringProducts: async (days = 60) => {
    const sanitizedDays = parseInt(days);
    if (isNaN(sanitizedDays) || sanitizedDays < 1 || sanitizedDays > 365) {
      throw new Error(`Invalid days value: ${days}. Must be between 1 and 365.`);
    }

    const sql = `
      SELECT 
        p.id,
        p.name,
        p.category,
        p.price,
        p.image_url,
        p.expiry_date,
        s.quantity,
        DATEDIFF(p.expiry_date, CURDATE()) AS days_until_expiry
      FROM products p
      INNER JOIN stock s ON p.id = s.product_id
      WHERE p.expiry_date IS NOT NULL
        AND p.expiry_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL ${sanitizedDays} DAY)
      ORDER BY p.expiry_date ASC, days_until_expiry ASC
    `;
    const [rows] = await db.promise().query(sql);
    return rows.map((row) => ({
      product_id: row.id,
      name: row.name,
      category: row.category,
      price: parseFloat(row.price) || 0,
      image_url: row.image_url,
      expiry_date: row.expiry_date,
      quantity: parseInt(row.quantity) || 0,
      days_until_expiry: parseInt(row.days_until_expiry) || 0,
    }));
  },

  /**
   * Get inventory valuation (Module 2.10.2)
   * Calculates total monetary value of current stock
   * Uses current products.price (not unit_price_at_sale) for current asset valuation
   */
  getInventoryValuation: async () => {
    const sql = `
      SELECT 
        COALESCE(SUM(s.quantity * p.price), 0) AS total_value,
        COUNT(DISTINCT p.id) AS total_products,
        COUNT(DISTINCT CASE WHEN s.quantity > 0 THEN p.id END) AS products_in_stock,
        COALESCE(SUM(s.quantity), 0) AS total_units
      FROM products p
      INNER JOIN stock s ON p.id = s.product_id
    `;
    const [rows] = await db.promise().query(sql);
    return {
      total_value: parseFloat(rows[0].total_value) || 0,
      total_products: parseInt(rows[0].total_products) || 0,
      products_in_stock: parseInt(rows[0].products_in_stock) || 0,
      total_units: parseInt(rows[0].total_units) || 0,
    };
  },

  /**
   * Get top selling products by volume (Module 2.10.3)
   * Returns products ordered by total quantity sold
   * Uses order_items for sales metrics
   * Only counts orders with status='Completed'
   */
  getTopSelling: async (limit = 10) => {
    const sanitizedLimit = parseInt(limit);
    if (isNaN(sanitizedLimit) || sanitizedLimit < 1 || sanitizedLimit > 100) {
      throw new Error(`Invalid limit value: ${limit}. Must be between 1 and 100.`);
    }

    const sql = `
      SELECT 
        p.id AS product_id,
        p.name,
        p.category,
        p.price,
        p.image_url,
        COALESCE(SUM(oi.quantity), 0) AS total_quantity_sold,
        COUNT(DISTINCT o.order_id) AS order_count,
        COALESCE(SUM(oi.quantity * oi.unit_price_at_sale), 0) AS total_revenue
      FROM products p
      INNER JOIN order_items oi ON p.id = oi.product_id
      INNER JOIN orders o ON oi.order_id = o.order_id
      WHERE o.status = 'Completed'
      GROUP BY p.id, p.name, p.category, p.price, p.image_url
      ORDER BY total_quantity_sold DESC
      LIMIT ${sanitizedLimit}
    `;

    const [rows] = await db.promise().query(sql);
    return rows.map((row) => ({
      product_id: row.product_id,
      name: row.name,
      category: row.category,
      price: parseFloat(row.price) || 0,
      image_url: row.image_url,
      total_quantity_sold: parseInt(row.total_quantity_sold) || 0,
      order_count: parseInt(row.order_count) || 0,
      total_revenue: parseFloat(row.total_revenue) || 0,
    }));
  },

  /**
   * Get dead stock / slow stock (Module 2.10.3)
   * Returns products in stock but not sold in the last 30 days
   * This identifies sitting capital
   * Must use order_items for sales metrics
   */
  getDeadStock: async () => {
    const sql = `
      SELECT 
        p.id AS product_id,
        p.name,
        p.category,
        p.price,
        p.image_url,
        s.quantity,
        s.min_stock_level,
        (s.quantity * p.price) AS sitting_capital
      FROM products p
      INNER JOIN stock s ON p.id = s.product_id
      WHERE s.quantity > 0
        AND p.id NOT IN (
          SELECT DISTINCT oi.product_id
          FROM order_items oi
          INNER JOIN orders o ON oi.order_id = o.order_id
          WHERE o.status = 'Completed'
            AND oi.created_at > DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        )
      ORDER BY sitting_capital DESC, p.name ASC
    `;

    const [rows] = await db.promise().query(sql);
    return rows.map((row) => ({
      product_id: row.product_id,
      name: row.name,
      category: row.category,
      price: parseFloat(row.price) || 0,
      image_url: row.image_url,
      quantity: parseInt(row.quantity) || 0,
      min_stock_level: parseInt(row.min_stock_level) || 0,
      sitting_capital: parseFloat(row.sitting_capital) || 0,
    }));
  },

  /**
   * Get category sales breakdown (Module 2.10.3)
   * Returns revenue grouped by category
   * Uses order_items.unit_price_at_sale for historical accuracy
   * Only counts orders with status='Completed'
   */
  getCategorySales: async () => {
    const sql = `
      SELECT 
        p.category,
        COALESCE(SUM(oi.quantity * oi.unit_price_at_sale), 0) AS total_revenue,
        COALESCE(SUM(oi.quantity), 0) AS total_quantity_sold,
        COUNT(DISTINCT o.order_id) AS order_count,
        COUNT(DISTINCT oi.product_id) AS product_count
      FROM products p
      INNER JOIN order_items oi ON p.id = oi.product_id
      INNER JOIN orders o ON oi.order_id = o.order_id
      WHERE o.status = 'Completed'
      GROUP BY p.category
      ORDER BY total_revenue DESC
    `;

    const [rows] = await db.promise().query(sql);
    return rows.map((row) => ({
      category: row.category || 'Uncategorized',
      total_revenue: parseFloat(row.total_revenue) || 0,
      total_quantity_sold: parseInt(row.total_quantity_sold) || 0,
      order_count: parseInt(row.order_count) || 0,
      product_count: parseInt(row.product_count) || 0,
    }));
  },
};

module.exports = Reports;

