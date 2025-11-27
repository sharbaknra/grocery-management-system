import { reportsService } from "../../services/reportsService.js";
import { stockService } from "../../services/stockService.js";
import { ordersService } from "../../services/ordersService.js";

export function registerDashboardPage(register) {
  register("dashboard", dashboardPage);
}

function dashboardPage() {
  return {
    html: `
      <div class="max-w-7xl mx-auto space-y-6">
        <!-- Page Header -->
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 class="text-3xl font-black tracking-tight text-text-primary-light dark:text-text-primary-dark">Dashboard</h1>
            <p class="text-text-secondary-light dark:text-text-secondary-dark mt-1">Welcome! Here's what's happening at your store today.</p>
          </div>
          <div class="flex gap-3">
            <button data-route="products" class="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors">
              <span class="material-symbols-outlined text-lg">add</span>
              Add Product
            </button>
          </div>
        </div>
        
        <!-- KPI Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Today's Sales -->
          <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-5">
            <div class="flex items-center justify-between">
              <div class="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                <span class="material-symbols-outlined text-primary text-2xl">payments</span>
              </div>
              <span class="flex items-center gap-1 text-xs font-medium text-success">
                <span class="material-symbols-outlined text-sm">trending_up</span>
                +12%
              </span>
            </div>
            <div class="mt-4">
              <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">Today's Sales</p>
              <p data-kpi="todaySales" class="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mt-1">Rs. 0</p>
            </div>
          </div>
          
          <!-- Total Orders -->
          <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-5">
            <div class="flex items-center justify-between">
              <div class="flex items-center justify-center w-12 h-12 rounded-lg bg-success/10">
                <span class="material-symbols-outlined text-success text-2xl">shopping_bag</span>
              </div>
              <span class="flex items-center gap-1 text-xs font-medium text-success">
                <span class="material-symbols-outlined text-sm">trending_up</span>
                +8%
              </span>
            </div>
            <div class="mt-4">
              <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">Total Orders</p>
              <p data-kpi="totalOrders" class="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mt-1">0</p>
            </div>
          </div>
          
          <!-- Low Stock Items -->
          <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-5">
            <div class="flex items-center justify-between">
              <div class="flex items-center justify-center w-12 h-12 rounded-lg bg-warning/10">
                <span class="material-symbols-outlined text-warning text-2xl">inventory</span>
              </div>
              <span class="flex items-center gap-1 text-xs font-medium text-warning">
                <span class="material-symbols-outlined text-sm">warning</span>
                Alert
              </span>
            </div>
            <div class="mt-4">
              <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">Low Stock Items</p>
              <p data-kpi="lowStock" class="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mt-1">0</p>
            </div>
          </div>
          
          <!-- Total Products -->
          <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-5">
            <div class="flex items-center justify-between">
              <div class="flex items-center justify-center w-12 h-12 rounded-lg bg-purple-500/10">
                <span class="material-symbols-outlined text-purple-500 text-2xl">category</span>
              </div>
            </div>
            <div class="mt-4">
              <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">Total Products</p>
              <p data-kpi="totalProducts" class="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mt-1">0</p>
            </div>
          </div>
        </div>
        
        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Low Stock Alert -->
          <div class="lg:col-span-2 bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
            <div class="flex items-center justify-between px-6 py-4 border-b border-border-light dark:border-border-dark">
              <h3 class="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">Low Stock Alert</h3>
              <button data-route="stock" class="text-sm font-medium text-primary hover:underline">View All</button>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-background-light dark:bg-background-dark">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Product</th>
                    <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Current</th>
                    <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Min Level</th>
                    <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Status</th>
                  </tr>
                </thead>
                <tbody data-low-stock-table class="divide-y divide-border-light dark:divide-border-dark">
                  <tr>
                    <td colspan="4" class="px-6 py-8 text-center text-text-secondary-light dark:text-text-secondary-dark">
                      <span class="material-symbols-outlined text-4xl mb-2 block">inventory_2</span>
                      Loading stock data...
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <!-- Recent Orders -->
          <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
            <div class="flex items-center justify-between px-6 py-4 border-b border-border-light dark:border-border-dark">
              <h3 class="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">Recent Orders</h3>
              <button data-route="orders" class="text-sm font-medium text-primary hover:underline">View All</button>
            </div>
            <div data-recent-orders class="divide-y divide-border-light dark:divide-border-dark">
              <div class="px-6 py-8 text-center text-text-secondary-light dark:text-text-secondary-dark">
                <span class="material-symbols-outlined text-4xl mb-2 block">receipt_long</span>
                Loading orders...
              </div>
            </div>
          </div>
        </div>
        
        <!-- Quick Actions -->
        <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6">
          <h3 class="text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-4">Quick Actions</h3>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button data-route="product-form" class="flex flex-col items-center gap-2 p-4 rounded-lg bg-background-light dark:bg-background-dark hover:bg-primary/10 transition-colors group">
              <span class="material-symbols-outlined text-3xl text-text-secondary-light dark:text-text-secondary-dark group-hover:text-primary">add_box</span>
              <span class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">New Product</span>
            </button>
            <button data-route="stock" class="flex flex-col items-center gap-2 p-4 rounded-lg bg-background-light dark:bg-background-dark hover:bg-primary/10 transition-colors group">
              <span class="material-symbols-outlined text-3xl text-text-secondary-light dark:text-text-secondary-dark group-hover:text-primary">sync</span>
              <span class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">Update Stock</span>
            </button>
            <button data-route="cart" class="flex flex-col items-center gap-2 p-4 rounded-lg bg-background-light dark:bg-background-dark hover:bg-primary/10 transition-colors group">
              <span class="material-symbols-outlined text-3xl text-text-secondary-light dark:text-text-secondary-dark group-hover:text-primary">point_of_sale</span>
              <span class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">New Sale</span>
            </button>
            <button data-route="reports" class="flex flex-col items-center gap-2 p-4 rounded-lg bg-background-light dark:bg-background-dark hover:bg-primary/10 transition-colors group">
              <span class="material-symbols-outlined text-3xl text-text-secondary-light dark:text-text-secondary-dark group-hover:text-primary">analytics</span>
              <span class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">View Reports</span>
            </button>
          </div>
        </div>
      </div>
    `,

    async onMount() {
      // Fetch dashboard data
      try {
        const [salesData, lowStockData, ordersData] = await Promise.allSettled([
          reportsService.getSalesSummary(),
          stockService.getLowStock(),
          ordersService.list({ limit: 5 }),
        ]);

        // Update KPIs
        if (salesData.status === "fulfilled") {
          const sales = salesData.value;
          updateKPI("todaySales", formatCurrency(sales.todaySales || 0));
          updateKPI("totalOrders", sales.totalOrders || 0);
          updateKPI("totalProducts", sales.totalProducts || 0);
        }

        // Update low stock count and table
        if (lowStockData.status === "fulfilled") {
          const lowStock = lowStockData.value || [];
          updateKPI("lowStock", lowStock.length);
          renderLowStockTable(lowStock.slice(0, 5));
        }

        // Update recent orders
        if (ordersData.status === "fulfilled") {
          const orders = ordersData.value?.orders || ordersData.value || [];
          renderRecentOrders(orders.slice(0, 5));
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      }
    },
  };
}

function updateKPI(key, value) {
  const el = document.querySelector(`[data-kpi="${key}"]`);
  if (el) el.textContent = value;
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function renderLowStockTable(items) {
  const tbody = document.querySelector("[data-low-stock-table]");
  if (!tbody) return;

  if (!items.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="px-6 py-8 text-center text-text-secondary-light dark:text-text-secondary-dark">
          <span class="material-symbols-outlined text-4xl mb-2 block text-success">check_circle</span>
          All products are well stocked!
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = items
    .map((item) => {
      const status = item.quantity <= 0 ? "Out of Stock" : "Low Stock";
      const statusClass = item.quantity <= 0 
        ? "bg-danger/10 text-danger" 
        : "bg-warning/10 text-warning";
      
      return `
        <tr class="hover:bg-background-light dark:hover:bg-background-dark transition-colors">
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">${item.name || item.product_name}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-text-secondary-light dark:text-text-secondary-dark">${item.quantity || item.stock_quantity}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-text-secondary-light dark:text-text-secondary-dark">${item.min_stock_level || 10}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span class="inline-flex items-center gap-1.5 rounded-full ${statusClass} px-2.5 py-1 text-xs font-medium">
              <span class="w-1.5 h-1.5 rounded-full ${item.quantity <= 0 ? 'bg-danger' : 'bg-warning'}"></span>
              ${status}
            </span>
          </td>
        </tr>
      `;
    })
    .join("");
}

function renderRecentOrders(orders) {
  const container = document.querySelector("[data-recent-orders]");
  if (!container) return;

  if (!orders.length) {
    container.innerHTML = `
      <div class="px-6 py-8 text-center text-text-secondary-light dark:text-text-secondary-dark">
        <span class="material-symbols-outlined text-4xl mb-2 block">receipt_long</span>
        No recent orders
      </div>
    `;
    return;
  }

  container.innerHTML = orders
    .map((order) => {
      const date = new Date(order.created_at || order.order_date);
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      return `
        <div class="flex items-center justify-between px-6 py-4 hover:bg-background-light dark:hover:bg-background-dark transition-colors">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <span class="material-symbols-outlined text-primary">receipt</span>
            </div>
            <div>
              <p class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">Order #${order.id}</p>
              <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark">${formattedDate}</p>
            </div>
          </div>
          <p class="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">${formatCurrency(order.total_amount || order.total || 0)}</p>
        </div>
      `;
    })
    .join("");
}
