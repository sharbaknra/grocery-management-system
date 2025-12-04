import { reportsService } from "../../services/reportsService.js";

export function registerReportsPage(register) {
  register("reports", reportsPage);
}

function reportsPage() {
  return {
    html: `
      <div class="max-w-7xl mx-auto space-y-6">
        <!-- Page Header -->
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 class="text-3xl font-black tracking-tight text-text-primary-light dark:text-text-primary-dark">Reports</h1>
            <p class="text-text-secondary-light dark:text-text-secondary-dark mt-1">Generate and view business reports.</p>
          </div>
        </div>
        
        <!-- Report Type Selection -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button data-report-type="sales" class="report-type-btn flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-primary bg-primary/5 text-primary transition-colors">
            <span class="material-symbols-outlined text-4xl">payments</span>
            <span class="font-medium">Sales Summary</span>
          </button>
          <button data-report-type="inventory" class="report-type-btn flex flex-col items-center gap-3 p-6 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark hover:border-primary hover:bg-primary/5 hover:text-primary transition-colors">
            <span class="material-symbols-outlined text-4xl">inventory_2</span>
            <span class="font-medium">Inventory Status</span>
          </button>
          <button data-report-type="products" class="report-type-btn flex flex-col items-center gap-3 p-6 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark hover:border-primary hover:bg-primary/5 hover:text-primary transition-colors">
            <span class="material-symbols-outlined text-4xl">trending_up</span>
            <span class="font-medium">Top Products</span>
          </button>
          <button data-report-type="expiring" class="report-type-btn flex flex-col items-center gap-3 p-6 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark hover:border-primary hover:bg-primary/5 hover:text-primary transition-colors">
            <span class="material-symbols-outlined text-4xl">schedule</span>
            <span class="font-medium">Expiring Soon</span>
          </button>
        </div>
        
        <!-- Filters -->
        <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-4">
          <div class="flex flex-wrap items-center gap-4">
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">From:</label>
              <input 
                type="date"
                data-start-date
                class="form-input h-10 px-3 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">To:</label>
              <input 
                type="date"
                data-end-date
                class="form-input h-10 px-3 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button data-generate-report class="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors">
              <span class="material-symbols-outlined text-lg">refresh</span>
              Generate
            </button>
            <div class="ml-auto flex gap-2">
              <button data-export-csv class="flex items-center gap-2 px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark font-medium hover:bg-border-light dark:hover:bg-border-dark transition-colors">
                <span class="material-symbols-outlined text-lg">download</span>
                CSV
              </button>
              <button data-export-pdf class="flex items-center gap-2 px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark font-medium hover:bg-border-light dark:hover:bg-border-dark transition-colors">
                <span class="material-symbols-outlined text-lg">picture_as_pdf</span>
                PDF
              </button>
            </div>
          </div>
        </div>
        
        <!-- Report Content -->
        <div data-report-content class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
          <!-- Loading -->
          <div data-report-loading class="hidden flex-col items-center justify-center py-20">
            <div class="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
            <p class="text-text-secondary-light dark:text-text-secondary-dark">Generating report...</p>
          </div>
          
          <!-- Report Output -->
          <div data-report-output class="p-6">
            <div class="text-center py-12">
              <span class="material-symbols-outlined text-5xl text-text-secondary-light dark:text-text-secondary-dark mb-4 block">bar_chart</span>
              <p class="text-lg font-medium text-text-primary-light dark:text-text-primary-dark">Select a report type</p>
              <p class="text-text-secondary-light dark:text-text-secondary-dark mt-1">Choose a report type above to generate data.</p>
            </div>
          </div>
        </div>
      </div>
    `,

    async onMount() {
      const reportTypeBtns = document.querySelectorAll("[data-report-type]");
      const loadingEl = document.querySelector("[data-report-loading]");
      const outputEl = document.querySelector("[data-report-output]");
      const generateBtn = document.querySelector("[data-generate-report]");
      const startDateInput = document.querySelector("[data-start-date]");
      const endDateInput = document.querySelector("[data-end-date]");

      let currentReportType = "sales";
      let currentReportData = null;

      // Set default dates (last 30 days)
      const today = new Date();
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      if (startDateInput) startDateInput.value = thirtyDaysAgo.toISOString().split("T")[0];
      if (endDateInput) endDateInput.value = today.toISOString().split("T")[0];

      function showLoading() {
        loadingEl?.classList.remove("hidden");
        loadingEl?.classList.add("flex");
        outputEl?.classList.add("hidden");
      }

      function showOutput() {
        loadingEl?.classList.add("hidden");
        outputEl?.classList.remove("hidden");
      }

      function updateActiveReportType(type) {
        reportTypeBtns.forEach((btn) => {
          const isActive = btn.dataset.reportType === type;
          btn.classList.toggle("border-2", isActive);
          btn.classList.toggle("border-primary", isActive);
          btn.classList.toggle("bg-primary/5", isActive);
          btn.classList.toggle("text-primary", isActive);
          btn.classList.toggle("border", !isActive);
          btn.classList.toggle("border-border-light", !isActive);
          btn.classList.toggle("dark:border-border-dark", !isActive);
        });
        currentReportType = type;
      }

      async function generateReport() {
        const startDate = startDateInput?.value;
        const endDate = endDateInput?.value;

        try {
          showLoading();

          let data;
          switch (currentReportType) {
            case "sales":
              data = await reportsService.getSalesSummary({ start_date: startDate, end_date: endDate });
              renderSalesReport(data);
              break;
            case "inventory":
              data = await reportsService.getLowStock();
              renderInventoryReport(data);
              break;
            case "products":
              data = await reportsService.getTopSelling({ start_date: startDate, end_date: endDate });
              renderTopProductsReport(data);
              break;
            case "expiring":
              data = await reportsService.getExpiringProducts();
              renderExpiringReport(data);
              break;
            default:
              data = await reportsService.getSalesSummary();
              renderSalesReport(data);
          }

          currentReportData = data;
          showOutput();
        } catch (error) {
          console.error("Failed to generate report:", error);
          outputEl.innerHTML = `
            <div class="text-center py-12">
              <span class="material-symbols-outlined text-5xl text-danger mb-4 block">error</span>
              <p class="text-lg font-medium text-text-primary-light dark:text-text-primary-dark">Failed to generate report</p>
              <p class="text-text-secondary-light dark:text-text-secondary-dark mt-1">${error.message || "Please try again later."}</p>
            </div>
          `;
          showOutput();
        }
      }

      function renderSalesReport(data) {
        if (!outputEl) return;
        
        // Handle API response structure: { success: true, data: { today: {...}, week: {...}, month: {...} } }
        const salesData = data?.data || data || {};
        const today = salesData.today || {};
        const totalSales = today.revenue || salesData.total_sales || data.total_sales || data.todaySales || 0;
        const totalOrders = today.orders || salesData.total_orders || data.total_orders || data.totalOrders || 0;
        const avgOrder = totalOrders > 0 ? totalSales / totalOrders : 0;

        outputEl.innerHTML = `
          <h3 class="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6">Sales Summary</h3>
          
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div class="bg-background-light dark:bg-background-dark rounded-lg p-4">
              <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">Total Sales</p>
              <p class="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mt-1">${formatCurrency(totalSales)}</p>
            </div>
            <div class="bg-background-light dark:bg-background-dark rounded-lg p-4">
              <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">Total Orders</p>
              <p class="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mt-1">${totalOrders}</p>
            </div>
            <div class="bg-background-light dark:bg-background-dark rounded-lg p-4">
              <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">Average Order</p>
              <p class="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mt-1">${formatCurrency(avgOrder)}</p>
            </div>
          </div>
          
          ${data.daily_sales ? renderDailySalesChart(data.daily_sales) : ""}
        `;
      }

      function renderInventoryReport(data) {
        if (!outputEl) return;
        const items = Array.isArray(data) ? data : data.items || [];

        outputEl.innerHTML = `
          <h3 class="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6">Inventory Status</h3>
          
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="border-b border-border-light dark:border-border-dark">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Product</th>
                  <th class="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Current Stock</th>
                  <th class="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Min Level</th>
                  <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border-light dark:divide-border-dark">
                ${items.length ? items.map((item) => {
                  const qty = item.stock_quantity || item.quantity || 0;
                  const min = item.min_stock_level || 10;
                  const status = qty <= 0 ? { label: "Out of Stock", class: "bg-danger/10 text-danger" } 
                    : qty < min ? { label: "Low Stock", class: "bg-warning/10 text-warning" }
                    : { label: "OK", class: "bg-success/10 text-success" };
                  
                  return `
                    <tr>
                      <td class="px-4 py-3 text-sm text-text-primary-light dark:text-text-primary-dark">${item.name || item.product_name}</td>
                      <td class="px-4 py-3 text-sm text-center text-text-primary-light dark:text-text-primary-dark">${qty}</td>
                      <td class="px-4 py-3 text-sm text-center text-text-secondary-light dark:text-text-secondary-dark">${min}</td>
                      <td class="px-4 py-3">
                        <span class="inline-flex items-center rounded-full ${status.class} px-2.5 py-1 text-xs font-medium">${status.label}</span>
                      </td>
                    </tr>
                  `;
                }).join("") : `
                  <tr>
                    <td colspan="4" class="px-4 py-8 text-center text-text-secondary-light dark:text-text-secondary-dark">
                      No low stock items found.
                    </td>
                  </tr>
                `}
              </tbody>
            </table>
          </div>
        `;
      }

      function renderTopProductsReport(data) {
        if (!outputEl) return;
        const products = Array.isArray(data) ? data : data.products || [];

        outputEl.innerHTML = `
          <h3 class="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6">Top Selling Products</h3>
          
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="border-b border-border-light dark:border-border-dark">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Rank</th>
                  <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Product</th>
                  <th class="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Units Sold</th>
                  <th class="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Revenue</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border-light dark:divide-border-dark">
                ${products.length ? products.map((product, index) => `
                  <tr>
                    <td class="px-4 py-3">
                      <span class="flex items-center justify-center w-8 h-8 rounded-full ${index < 3 ? 'bg-primary text-white' : 'bg-background-light dark:bg-background-dark text-text-secondary-light dark:text-text-secondary-dark'} text-sm font-bold">
                        ${index + 1}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-sm font-medium text-text-primary-light dark:text-text-primary-dark">${product.name || product.product_name}</td>
                    <td class="px-4 py-3 text-sm text-center text-text-primary-light dark:text-text-primary-dark">${product.units_sold || product.quantity_sold || 0}</td>
                    <td class="px-4 py-3 text-sm text-right font-medium text-text-primary-light dark:text-text-primary-dark">${formatCurrency(product.revenue || product.total_revenue || 0)}</td>
                  </tr>
                `).join("") : `
                  <tr>
                    <td colspan="4" class="px-4 py-8 text-center text-text-secondary-light dark:text-text-secondary-dark">
                      No sales data available for this period.
                    </td>
                  </tr>
                `}
              </tbody>
            </table>
          </div>
        `;
      }

      function renderExpiringReport(data) {
        if (!outputEl) return;
        const products = Array.isArray(data) ? data : data.products || [];

        outputEl.innerHTML = `
          <h3 class="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6">Products Expiring Soon</h3>
          
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="border-b border-border-light dark:border-border-dark">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Product</th>
                  <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Expiry Date</th>
                  <th class="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Days Left</th>
                  <th class="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Stock</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border-light dark:divide-border-dark">
                ${products.length ? products.map((product) => {
                  const expiryDate = new Date(product.expiry_date);
                  const today = new Date();
                  const daysLeft = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
                  const urgencyClass = daysLeft <= 7 ? "text-danger" : daysLeft <= 14 ? "text-warning" : "text-text-primary-light dark:text-text-primary-dark";
                  
                  return `
                    <tr>
                      <td class="px-4 py-3 text-sm font-medium text-text-primary-light dark:text-text-primary-dark">${product.name}</td>
                      <td class="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">${expiryDate.toLocaleDateString()}</td>
                      <td class="px-4 py-3 text-sm text-center font-bold ${urgencyClass}">${daysLeft} days</td>
                      <td class="px-4 py-3 text-sm text-center text-text-primary-light dark:text-text-primary-dark">${product.stock_quantity || 0}</td>
                    </tr>
                  `;
                }).join("") : `
                  <tr>
                    <td colspan="4" class="px-4 py-8 text-center text-text-secondary-light dark:text-text-secondary-dark">
                      No products expiring soon.
                    </td>
                  </tr>
                `}
              </tbody>
            </table>
          </div>
        `;
      }

      function renderDailySalesChart(dailySales) {
        // Simple text-based representation since we don't have a chart library
        return `
          <div class="mt-6">
            <h4 class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-4">Daily Sales Trend</h4>
            <div class="space-y-2">
              ${dailySales.slice(-7).map((day) => {
                const maxSales = Math.max(...dailySales.map((d) => d.total || d.sales || 0));
                const sales = day.total || day.sales || 0;
                const percentage = maxSales > 0 ? (sales / maxSales) * 100 : 0;
                
                return `
                  <div class="flex items-center gap-4">
                    <span class="w-20 text-xs text-text-secondary-light dark:text-text-secondary-dark">${day.date || day.day}</span>
                    <div class="flex-1 h-6 bg-background-light dark:bg-background-dark rounded overflow-hidden">
                      <div class="h-full bg-primary rounded" style="width: ${percentage}%"></div>
                    </div>
                    <span class="w-20 text-xs font-medium text-text-primary-light dark:text-text-primary-dark text-right">${formatCurrency(sales)}</span>
                  </div>
                `;
              }).join("")}
            </div>
          </div>
        `;
      }

      // Report type selection
      reportTypeBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          updateActiveReportType(btn.dataset.reportType);
          generateReport();
        });
      });

      // Generate button
      generateBtn?.addEventListener("click", generateReport);

      // Export buttons
      document.querySelector("[data-export-csv]")?.addEventListener("click", () => {
        if (!currentReportData) {
          alert("Please generate a report first.");
          return;
        }
        alert("CSV export would be implemented here with the current report data.");
      });

      document.querySelector("[data-export-pdf]")?.addEventListener("click", () => {
        if (!currentReportData) {
          alert("Please generate a report first.");
          return;
        }
        alert("PDF export would be implemented here with the current report data.");
      });

      // Initial report
      await generateReport();
    },
  };
}

function formatCurrency(amount) {
  return `Rs. ${Math.round(amount).toLocaleString('en-PK')}`;
}
