import { reportsService } from "../../services/reportsService.js";
import { getState, appActions } from "../../state/appState.js";
import { apiClient } from "../../services/apiClient.js";

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
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-report-selector>
          <!-- Buttons rendered dynamically based on role -->
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
              <button 
                data-export-csv 
                disabled
                class="flex items-center gap-2 px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark font-medium hover:bg-border-light dark:hover:bg-border-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Report not generated yet. Please generate a report first."
                aria-label="Export report as CSV"
              >
                <span class="material-symbols-outlined text-lg">download</span>
                CSV
              </button>
              <button 
                data-export-pdf 
                disabled
                class="flex items-center gap-2 px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark font-medium hover:bg-border-light dark:hover:bg-border-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Report not generated yet. Please generate a report first."
                aria-label="Export report as PDF"
              >
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

        <!-- Generate Report Confirmation Modal -->
        <div data-generate-modal class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-xl max-w-md w-full">
            <div class="p-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                  <span class="material-symbols-outlined text-primary text-2xl">refresh</span>
      </div>
                <div>
                  <h3 class="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">Generate Report</h3>
                  <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">Confirm to generate the selected report</p>
                </div>
              </div>
              
              <div class="mb-6 space-y-2">
                <div class="flex items-center justify-between py-2 border-b border-border-light dark:border-border-dark">
                  <span class="text-sm text-text-secondary-light dark:text-text-secondary-dark">Report Type:</span>
                  <span data-modal-report-type class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">-</span>
                </div>
                <div class="flex items-center justify-between py-2 border-b border-border-light dark:border-border-dark">
                  <span class="text-sm text-text-secondary-light dark:text-text-secondary-dark">Date Range:</span>
                  <span data-modal-date-range class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">-</span>
                </div>
              </div>

              <div class="flex items-center justify-end gap-3">
                <button 
                  data-cancel-generate
                  class="px-4 py-2.5 rounded-lg bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark font-medium hover:bg-border-light dark:hover:bg-border-dark transition-colors"
                >
                  Cancel
                </button>
                <button 
                  data-confirm-generate
                  class="px-6 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors flex items-center gap-2"
                >
                  <span class="material-symbols-outlined text-lg">check</span>
                  Generate
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Report Generated Success Dialog -->
        <div data-success-dialog class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div data-success-dialog-content class="bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark shadow-2xl w-full max-w-md animate-scale-in transition-all duration-300">
            <!-- Summary View -->
            <div data-success-summary class="p-8">
              <!-- Success Icon with Animation -->
              <div class="flex items-center justify-center mb-6">
                <div class="relative w-20 h-20">
                  <!-- Pulsing Background Circle -->
                  <div class="absolute inset-0 rounded-full bg-success/20 animate-pulse"></div>
                  <!-- Outer Circle -->
                  <div class="absolute inset-0 rounded-full bg-success/10"></div>
                  <!-- Animated Circle -->
                  <svg class="absolute inset-0 w-20 h-20 transform -rotate-90" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      stroke-width="2" 
                      stroke-dasharray="62.83" 
                      stroke-dashoffset="62.83"
                      class="text-success"
                      style="animation: drawCircle 0.6s ease-out forwards;"
                    />
                  </svg>
                  <!-- Animated Checkmark -->
                  <svg class="absolute inset-0 w-20 h-20 text-success" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path 
                      d="M9 12l2 2 4-4" 
                      stroke="currentColor" 
                      stroke-width="3" 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-dasharray="12" 
                      stroke-dashoffset="12"
                      style="animation: drawCheck 0.4s ease-out 0.3s forwards;"
                    />
                  </svg>
                </div>
              </div>
              
              <!-- Content -->
              <div class="text-center mb-6">
                <h3 class="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
                  Report Generated Successfully!
                </h3>
                <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-4">
                  Your report is ready to view and export.
                </p>
                <div class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-success/10 text-success text-sm font-medium">
                  <span class="material-symbols-outlined text-base">check_circle</span>
                  <span data-success-report-type>Report ready</span>
                </div>
              </div>
              
              <!-- Action Buttons -->
              <div class="flex flex-col gap-3">
                <button 
                  data-view-report
                  class="w-full px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <span class="material-symbols-outlined text-lg">visibility</span>
                  View Report
                </button>
                <button 
                  data-close-success
                  class="w-full px-6 py-3 rounded-lg bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark font-medium hover:bg-border-light dark:hover:bg-border-dark transition-all duration-200 border border-border-light dark:border-border-dark"
                >
                  Close
                </button>
              </div>
            </div>
            
            <!-- Report View -->
            <div data-success-report-view class="hidden">
              <div class="p-6 border-b border-border-light dark:border-border-dark flex items-center justify-between">
                <h3 class="text-lg font-bold text-text-primary-light dark:text-text-primary-dark flex items-center gap-2">
                  <span class="material-symbols-outlined text-primary">bar_chart</span>
                  <span data-report-view-title>Report</span>
                </h3>
                <button 
                  data-back-to-summary
                  class="p-2 rounded-lg hover:bg-background-light dark:hover:bg-background-dark transition-colors"
                  title="Back to summary"
                >
                  <span class="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark">close</span>
                </button>
              </div>
              <div data-success-report-content class="max-h-[70vh] overflow-y-auto p-6">
                <!-- Report content will be rendered here -->
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>
        @keyframes drawCircle {
          to {
            stroke-dashoffset: 0;
          }
        }
        
        @keyframes drawCheck {
          to {
            stroke-dashoffset: 0;
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-scale-in {
          animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      </style>
    `,

    async onMount() {
      let reportTypeBtns = [];
      const loadingEl = document.querySelector("[data-report-loading]");
      const outputEl = document.querySelector("[data-report-output]");
      const generateBtn = document.querySelector("[data-generate-report]");
      const startDateInput = document.querySelector("[data-start-date]");
      const endDateInput = document.querySelector("[data-end-date]");

      const userRole = getState().user?.role;
      const isPurchasing = userRole === "purchasing";

      // Default report type: sales for admin/staff, inventory for purchasing
      let currentReportType = isPurchasing ? "inventory" : "sales";
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

      function updateExportButtonsState(hasReport) {
        const csvBtn = document.querySelector("[data-export-csv]");
        const pdfBtn = document.querySelector("[data-export-pdf]");
        
        if (csvBtn) {
          csvBtn.disabled = !hasReport;
          csvBtn.title = hasReport 
            ? "Export report as CSV" 
            : "Report not generated yet. Please generate a report first.";
          csvBtn.setAttribute("aria-label", hasReport 
            ? "Export report as CSV" 
            : "Export CSV (disabled - report not generated yet)");
        }
        
        if (pdfBtn) {
          pdfBtn.disabled = !hasReport;
          pdfBtn.title = hasReport 
            ? "Export report as PDF" 
            : "Report not generated yet. Please generate a report first.";
          pdfBtn.setAttribute("aria-label", hasReport 
            ? "Export report as PDF" 
            : "Export PDF (disabled - report not generated yet)");
        }
      }

      function showSuccessDialog() {
        const successDialog = document.querySelector("[data-success-dialog]");
        const reportTypeEl = document.querySelector("[data-success-report-type]");
        const summaryView = document.querySelector("[data-success-summary]");
        const reportView = document.querySelector("[data-success-report-view]");
        const dialogContent = document.querySelector("[data-success-dialog-content]");
        
        if (successDialog) {
          // Reset to summary view
          if (summaryView) summaryView.classList.remove("hidden");
          if (reportView) reportView.classList.add("hidden");
          if (dialogContent) {
            dialogContent.classList.remove("max-w-5xl");
            dialogContent.classList.add("max-w-md");
          }
          
          // Update report type display
          if (reportTypeEl) {
            const reportTypeNames = {
              sales: "Sales Summary",
              inventory: "Inventory Report",
              products: "Top Products",
              expiring: "Expiring Products"
            };
            const reportTypeName = reportTypeNames[currentReportType] || currentReportType;
            reportTypeEl.textContent = reportTypeName;
          }
          
          successDialog.classList.remove("hidden");
          successDialog.classList.add("flex");
          
          // Popup stays open until user clicks outside or closes manually
        }
      }

      function showReportInDialog() {
        const summaryView = document.querySelector("[data-success-summary]");
        const reportView = document.querySelector("[data-success-report-view]");
        const reportContent = document.querySelector("[data-success-report-content]");
        const reportTitle = document.querySelector("[data-report-view-title]");
        const dialogContent = document.querySelector("[data-success-dialog-content]");
        
        if (!reportContent || !currentReportData) return;
        
        // Hide summary, show report view
        if (summaryView) summaryView.classList.add("hidden");
        if (reportView) reportView.classList.remove("hidden");
        
        // Expand dialog slightly for overview
        if (dialogContent) {
          dialogContent.classList.remove("max-w-md");
          dialogContent.classList.add("max-w-2xl");
        }
        
        // Update title
        if (reportTitle) {
          const reportTypeNames = {
            sales: "Sales Summary",
            inventory: "Inventory Report",
            products: "Top Products",
            expiring: "Expiring Products"
          };
          reportTitle.textContent = reportTypeNames[currentReportType] || currentReportType;
        }
        
        // Render report overview based on type
        switch (currentReportType) {
          case "sales":
            renderSalesReportOverview(currentReportData, reportContent);
            break;
          case "inventory":
            renderInventoryReportOverview(currentReportData, reportContent);
            break;
          case "products":
            renderTopProductsReportOverview(currentReportData, reportContent);
            break;
          case "expiring":
            renderExpiringReportOverview(currentReportData, reportContent);
            break;
          default:
            renderSalesReportOverview(currentReportData, reportContent);
        }
      }

      function backToSummary() {
        const summaryView = document.querySelector("[data-success-summary]");
        const reportView = document.querySelector("[data-success-report-view]");
        const dialogContent = document.querySelector("[data-success-dialog-content]");
        
        if (summaryView) summaryView.classList.remove("hidden");
        if (reportView) reportView.classList.add("hidden");
        
        if (dialogContent) {
          dialogContent.classList.remove("max-w-5xl");
          dialogContent.classList.add("max-w-md");
        }
      }

      function hideSuccessDialog() {
        const successDialog = document.querySelector("[data-success-dialog]");
        if (successDialog) {
          successDialog.classList.add("hidden");
          successDialog.classList.remove("flex");
        }
      }

      async function generateReport(showSuccess = false) {
        const startDate = startDateInput?.value;
        const endDate = endDateInput?.value;

        try {
          showLoading();

          let data;
          switch (currentReportType) {
            case "sales":
              // Sales summary doesn't need date parameters - it returns today/week/month automatically
              data = await reportsService.getSalesSummary();
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
          
          // Enable export buttons only if user explicitly generated the report
          if (showSuccess) {
            updateExportButtonsState(true);
            showSuccessDialog();
          } else {
            // Keep buttons disabled for auto-loaded reports
            updateExportButtonsState(false);
          }
        } catch (error) {
          console.error("Failed to generate report:", error);
          currentReportData = null;
          
          // Check if it's an authentication error
          const isAuthError = error.status === 401 || 
                             error.message?.toLowerCase().includes("token") ||
                             error.message?.toLowerCase().includes("unauthorized") ||
                             error.message?.toLowerCase().includes("expired");
          
          if (isAuthError) {
            // Clear session for expired token
            appActions.clearSession();
            
            outputEl.innerHTML = `
              <div class="text-center py-12">
                <span class="material-symbols-outlined text-5xl text-danger mb-4 block">lock</span>
                <p class="text-lg font-medium text-text-primary-light dark:text-text-primary-dark mb-2">Session Expired</p>
                <p class="text-text-secondary-light dark:text-text-secondary-dark mb-4">
                  Your session has expired. Please log in again to continue.
                </p>
                <button 
                  onclick="window.location.reload()"
                  class="px-6 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors"
                >
                  Reload Page
                </button>
              </div>
            `;
          } else {
          outputEl.innerHTML = `
            <div class="text-center py-12">
              <span class="material-symbols-outlined text-5xl text-danger mb-4 block">error</span>
              <p class="text-lg font-medium text-text-primary-light dark:text-text-primary-dark">Failed to generate report</p>
              <p class="text-text-secondary-light dark:text-text-secondary-dark mt-1">${error.message || "Please try again later."}</p>
            </div>
          `;
          }
          
          showOutput();
          
          // Disable export buttons on error
          updateExportButtonsState(false);
        }
      }

      function renderSalesReport(data) {
        if (!outputEl) return;
        
        // Handle API response structure: { success: true, data: { today: {...}, week: {...}, month: {...}, totalProducts: ... } }
        const salesData = data?.data || data || {};
        const today = salesData.today || {};
        const week = salesData.week || {};
        const month = salesData.month || {};
        
        const todayRevenue = today.revenue || 0;
        const todayOrders = today.orders || 0;
        const todayItems = today.items_sold || 0;
        const todayAvg = todayOrders > 0 ? todayRevenue / todayOrders : 0;
        
        const weekRevenue = week.revenue || 0;
        const weekOrders = week.orders || 0;
        const weekItems = week.items_sold || 0;
        const weekAvg = weekOrders > 0 ? weekRevenue / weekOrders : 0;
        
        const monthRevenue = month.revenue || 0;
        const monthOrders = month.orders || 0;
        const monthItems = month.items_sold || 0;
        const monthAvg = monthOrders > 0 ? monthRevenue / monthOrders : 0;

        outputEl.innerHTML = `
          <div class="space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">Latest Sales Summary</h3>
              <span class="text-sm text-text-secondary-light dark:text-text-secondary-dark">Updated: ${new Date().toLocaleString()}</span>
            </div>
            
            <!-- Today's Sales -->
            <div class="bg-background-light dark:bg-background-dark rounded-xl border border-border-light dark:border-border-dark p-6">
              <div class="flex items-center gap-2 mb-4">
                <span class="material-symbols-outlined text-primary">today</span>
                <h4 class="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">Today's Sales</h4>
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">Revenue</p>
                  <p class="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">${formatCurrency(todayRevenue)}</p>
                </div>
                <div>
                  <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">Orders</p>
                  <p class="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">${todayOrders}</p>
                </div>
                <div>
                  <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">Items Sold</p>
                  <p class="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">${todayItems}</p>
                </div>
                <div>
                  <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">Avg Order</p>
                  <p class="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">${formatCurrency(todayAvg)}</p>
                </div>
              </div>
            </div>
            
            <!-- This Week's Sales -->
            <div class="bg-background-light dark:bg-background-dark rounded-xl border border-border-light dark:border-border-dark p-6">
              <div class="flex items-center gap-2 mb-4">
                <span class="material-symbols-outlined text-primary">date_range</span>
                <h4 class="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">This Week's Sales</h4>
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">Revenue</p>
                  <p class="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">${formatCurrency(weekRevenue)}</p>
                </div>
                <div>
                  <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">Orders</p>
                  <p class="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">${weekOrders}</p>
                </div>
                <div>
                  <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">Items Sold</p>
                  <p class="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">${weekItems}</p>
                </div>
                <div>
                  <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">Avg Order</p>
                  <p class="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">${formatCurrency(weekAvg)}</p>
                </div>
              </div>
            </div>
            
            <!-- This Month's Sales -->
            <div class="bg-background-light dark:bg-background-dark rounded-xl border border-border-light dark:border-border-dark p-6">
              <div class="flex items-center gap-2 mb-4">
                <span class="material-symbols-outlined text-primary">calendar_month</span>
                <h4 class="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">This Month's Sales</h4>
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">Revenue</p>
                  <p class="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">${formatCurrency(monthRevenue)}</p>
                </div>
                <div>
                  <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">Orders</p>
                  <p class="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">${monthOrders}</p>
                </div>
                <div>
                  <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">Items Sold</p>
                  <p class="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">${monthItems}</p>
                </div>
                <div>
                  <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">Avg Order</p>
                  <p class="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">${formatCurrency(monthAvg)}</p>
                </div>
              </div>
            </div>
            
            ${data.daily_sales ? renderDailySalesChart(data.daily_sales) : ""}
          </div>
        `;
      }

      function renderInventoryReport(data) {
        if (!outputEl) return;
        const items = Array.isArray(data)
          ? data
          : data.items || data.data?.items || [];

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

      // Dialog render functions - overview versions
      function renderSalesReportOverview(data, container) {
        if (!container) return;
        
        const salesData = data?.data || data || {};
        const month = salesData.month || {};
        const monthRevenue = month.revenue || 0;
        const monthOrders = month.orders || 0;
        const monthItems = month.items_sold || 0;
        const monthAvg = monthOrders > 0 ? monthRevenue / monthOrders : 0;

        container.innerHTML = `
          <div class="space-y-6">
            <!-- Key Metrics Overview -->
            <div class="bg-background-light dark:bg-background-dark rounded-xl border border-border-light dark:border-border-dark p-6">
              <h4 class="text-base font-bold text-text-primary-light dark:text-text-primary-dark mb-4 flex items-center gap-2">
                <span class="material-symbols-outlined text-primary">bar_chart</span>
                Report Summary
              </h4>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">Total Revenue</p>
                  <p class="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">${formatCurrency(monthRevenue)}</p>
                </div>
                <div>
                  <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">Total Orders</p>
                  <p class="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">${monthOrders}</p>
                </div>
                <div>
                  <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">Items Sold</p>
                  <p class="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">${monthItems}</p>
                </div>
                <div>
                  <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">Avg Order Value</p>
                  <p class="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">${formatCurrency(monthAvg)}</p>
                </div>
              </div>
            </div>
            
            <!-- Download Prompt -->
            <div class="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center">
              <span class="material-symbols-outlined text-primary text-4xl mb-3 block">download</span>
              <h4 class="text-base font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
                Need More Details?
              </h4>
              <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-4">
                Download the full report as PDF or CSV for complete data, charts, and detailed breakdowns.
              </p>
              <div class="flex gap-3 justify-center">
                <button 
                  data-download-pdf-overview
                  class="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors"
                >
                  <span class="material-symbols-outlined text-base">picture_as_pdf</span>
                  Download PDF
                </button>
                <button 
                  data-download-csv-overview
                  class="flex items-center gap-2 px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark text-sm font-medium hover:bg-border-light dark:hover:bg-border-dark transition-colors"
                >
                  <span class="material-symbols-outlined text-base">download</span>
                  Download CSV
                </button>
              </div>
            </div>
          </div>
        `;
      }

      function renderInventoryReportOverview(data, container) {
        if (!container) return;
        const items = Array.isArray(data) ? data : data.items || data.data?.items || [];
        
        const outOfStock = items.filter(item => (item.stock_quantity || item.quantity || 0) <= 0).length;
        const lowStock = items.filter(item => {
          const qty = item.stock_quantity || item.quantity || 0;
          const min = item.min_stock_level || 10;
          return qty > 0 && qty < min;
        }).length;
        const totalItems = items.length;

        container.innerHTML = `
          <div class="space-y-6">
            <!-- Overview Stats -->
            <div class="grid grid-cols-3 gap-4">
              <div class="bg-background-light dark:bg-background-dark rounded-xl border border-border-light dark:border-border-dark p-4 text-center">
                <div class="flex items-center justify-center gap-2 mb-2">
                  <span class="material-symbols-outlined text-danger text-xl">inventory_2</span>
                  <p class="text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark">Out of Stock</p>
                </div>
                <p class="text-2xl font-bold text-danger">${outOfStock}</p>
                <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark">items</p>
              </div>
              <div class="bg-background-light dark:bg-background-dark rounded-xl border border-border-light dark:border-border-dark p-4 text-center">
                <div class="flex items-center justify-center gap-2 mb-2">
                  <span class="material-symbols-outlined text-warning text-xl">warning</span>
                  <p class="text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark">Low Stock</p>
                </div>
                <p class="text-2xl font-bold text-warning">${lowStock}</p>
                <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark">items</p>
              </div>
              <div class="bg-background-light dark:bg-background-dark rounded-xl border border-border-light dark:border-border-dark p-4 text-center">
                <div class="flex items-center justify-center gap-2 mb-2">
                  <span class="material-symbols-outlined text-primary text-xl">list</span>
                  <p class="text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark">Total Items</p>
                </div>
                <p class="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">${totalItems}</p>
                <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark">in report</p>
              </div>
            </div>
            
            <!-- Download Prompt -->
            <div class="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center">
              <span class="material-symbols-outlined text-primary text-4xl mb-3 block">download</span>
              <h4 class="text-base font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
                Need More Details?
              </h4>
              <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-4">
                Download the full report as PDF or CSV for complete product list, stock levels, and detailed inventory status.
              </p>
              <div class="flex gap-3 justify-center">
                <button 
                  data-download-pdf-overview
                  class="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors"
                >
                  <span class="material-symbols-outlined text-base">picture_as_pdf</span>
                  Download PDF
                </button>
                <button 
                  data-download-csv-overview
                  class="flex items-center gap-2 px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark text-sm font-medium hover:bg-border-light dark:hover:bg-border-dark transition-colors"
                >
                  <span class="material-symbols-outlined text-base">download</span>
                  Download CSV
                </button>
              </div>
            </div>
          </div>
        `;
      }

      function renderTopProductsReportOverview(data, container) {
        if (!container) return;
        const products = Array.isArray(data) ? data : data.products || [];
        
        const top3 = products.slice(0, 3);
        const totalRevenue = products.reduce((sum, p) => sum + (p.revenue || p.total_revenue || 0), 0);
        const totalUnits = products.reduce((sum, p) => sum + (p.units_sold || p.quantity_sold || 0), 0);
        const totalProducts = products.length;

        container.innerHTML = `
          <div class="space-y-6">
            <!-- Key Metrics -->
            <div class="bg-background-light dark:bg-background-dark rounded-xl border border-border-light dark:border-border-dark p-6">
              <h4 class="text-base font-bold text-text-primary-light dark:text-text-primary-dark mb-4 flex items-center gap-2">
                <span class="material-symbols-outlined text-primary">trending_up</span>
                Report Summary
              </h4>
              <div class="grid grid-cols-3 gap-4 mb-4">
                <div class="text-center">
                  <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">Total Products</p>
                  <p class="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">${totalProducts}</p>
                </div>
                <div class="text-center">
                  <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">Total Revenue</p>
                  <p class="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">${formatCurrency(totalRevenue)}</p>
                </div>
                <div class="text-center">
                  <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">Units Sold</p>
                  <p class="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">${totalUnits}</p>
                </div>
              </div>
              
              ${top3.length > 0 ? `
                <div class="pt-4 border-t border-border-light dark:border-border-dark">
                  <p class="text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark mb-3">Top 3 Products</p>
                  <div class="space-y-2">
                    ${top3.map((product, index) => `
                      <div class="flex items-center justify-between text-sm">
                        <div class="flex items-center gap-2">
                          <span class="w-6 h-6 rounded-full ${index === 0 ? 'bg-primary text-white' : 'bg-background-light dark:bg-background-dark text-text-secondary-light dark:text-text-secondary-dark'} flex items-center justify-center text-xs font-bold">
                            ${index + 1}
                          </span>
                          <span class="text-text-primary-light dark:text-text-primary-dark">${product.name || product.product_name}</span>
                        </div>
                        <span class="font-medium text-text-primary-light dark:text-text-primary-dark">${formatCurrency(product.revenue || product.total_revenue || 0)}</span>
                      </div>
                    `).join("")}
                  </div>
                </div>
              ` : ''}
            </div>
            
            <!-- Download Prompt -->
            <div class="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center">
              <span class="material-symbols-outlined text-primary text-4xl mb-3 block">download</span>
              <h4 class="text-base font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
                Need More Details?
              </h4>
              <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-4">
                Download the full report as PDF or CSV for complete product rankings, sales data, and detailed analytics.
              </p>
              <div class="flex gap-3 justify-center">
                <button 
                  data-download-pdf-overview
                  class="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors"
                >
                  <span class="material-symbols-outlined text-base">picture_as_pdf</span>
                  Download PDF
                </button>
                <button 
                  data-download-csv-overview
                  class="flex items-center gap-2 px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark text-sm font-medium hover:bg-border-light dark:hover:bg-border-dark transition-colors"
                >
                  <span class="material-symbols-outlined text-base">download</span>
                  Download CSV
                </button>
              </div>
            </div>
          </div>
        `;
      }

      function renderExpiringReportOverview(data, container) {
        if (!container) return;
        const products = Array.isArray(data) ? data : data.products || [];
        
        const urgent = products.filter(p => {
          const expiryDate = new Date(p.expiry_date);
          const today = new Date();
          const daysLeft = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
          return daysLeft <= 7;
        }).length;
        
        const warning = products.filter(p => {
          const expiryDate = new Date(p.expiry_date);
          const today = new Date();
          const daysLeft = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
          return daysLeft > 7 && daysLeft <= 14;
        }).length;
        
        const totalItems = products.length;

        container.innerHTML = `
          <div class="space-y-6">
            <!-- Overview Stats -->
            <div class="grid grid-cols-3 gap-4">
              <div class="bg-background-light dark:bg-background-dark rounded-xl border border-border-light dark:border-border-dark p-4 text-center">
                <div class="flex items-center justify-center gap-2 mb-2">
                  <span class="material-symbols-outlined text-danger text-xl">error</span>
                  <p class="text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark">Urgent</p>
                </div>
                <p class="text-2xl font-bold text-danger">${urgent}</p>
                <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark">≤ 7 days</p>
              </div>
              <div class="bg-background-light dark:bg-background-dark rounded-xl border border-border-light dark:border-border-dark p-4 text-center">
                <div class="flex items-center justify-center gap-2 mb-2">
                  <span class="material-symbols-outlined text-warning text-xl">warning</span>
                  <p class="text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark">Warning</p>
                </div>
                <p class="text-2xl font-bold text-warning">${warning}</p>
                <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark">8-14 days</p>
              </div>
              <div class="bg-background-light dark:bg-background-dark rounded-xl border border-border-light dark:border-border-dark p-4 text-center">
                <div class="flex items-center justify-center gap-2 mb-2">
                  <span class="material-symbols-outlined text-primary text-xl">inventory_2</span>
                  <p class="text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark">Total Items</p>
                </div>
                <p class="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">${totalItems}</p>
                <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark">expiring soon</p>
              </div>
            </div>
            
            <!-- Download Prompt -->
            <div class="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center">
              <span class="material-symbols-outlined text-primary text-4xl mb-3 block">download</span>
              <h4 class="text-base font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
                Need More Details?
              </h4>
              <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-4">
                Download the full report as PDF or CSV for complete product list, expiry dates, stock levels, and detailed expiration tracking.
              </p>
              <div class="flex gap-3 justify-center">
                <button 
                  data-download-pdf-overview
                  class="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors"
                >
                  <span class="material-symbols-outlined text-base">picture_as_pdf</span>
                  Download PDF
                </button>
                <button 
                  data-download-csv-overview
                  class="flex items-center gap-2 px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark text-sm font-medium hover:bg-border-light dark:hover:bg-border-dark transition-colors"
                >
                  <span class="material-symbols-outlined text-base">download</span>
                  Download CSV
                </button>
              </div>
            </div>
          </div>
        `;
      }

      const selectorEl = document.querySelector("[data-report-selector]");
      const availableReports = isPurchasing
        ? [
            { type: "inventory", label: "Inventory Status", icon: "inventory_2" },
            { type: "expiring", label: "Expiring Soon", icon: "schedule" },
          ]
        : [
            { type: "sales", label: "Sales Summary", icon: "payments" },
            { type: "inventory", label: "Inventory Status", icon: "inventory_2" },
            { type: "products", label: "Top Products", icon: "trending_up" },
            { type: "expiring", label: "Expiring Soon", icon: "schedule" },
          ];

      if (selectorEl) {
        selectorEl.innerHTML = availableReports
          .map(
            (report, index) => `
              <button 
                data-report-type="${report.type}"
                class="report-type-btn flex flex-col items-center gap-3 p-6 rounded-xl border ${
                  index === 0 ? "border-2 border-primary bg-primary/5 text-primary" : "border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark hover:border-primary hover:bg-primary/5 hover:text-primary"
                } transition-colors"
              >
                <span class="material-symbols-outlined text-4xl">${report.icon}</span>
                <span class="font-medium">${report.label}</span>
              </button>
            `
          )
          .join("");
      }

      reportTypeBtns = document.querySelectorAll("[data-report-type]");

      // Report type selection
      reportTypeBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          const type = btn.dataset.reportType;
          updateActiveReportType(type);
          generateReport(false); // Don't enable export buttons when just switching report types
        });
      });

      // Generate button
      // Generate button with confirmation modal
      generateBtn?.addEventListener("click", () => {
        const modal = document.querySelector("[data-generate-modal]");
        const modalReportType = document.querySelector("[data-modal-report-type]");
        const modalDateRange = document.querySelector("[data-modal-date-range]");
        
        if (modal && modalReportType && modalDateRange) {
          // Get report type name
          const reportTypeNames = {
            sales: "Sales Summary",
            inventory: "Inventory Report",
            products: "Top Products",
            expiring: "Expiring Products"
          };
          modalReportType.textContent = reportTypeNames[currentReportType] || currentReportType;
          
          // Get date range
          const startDate = startDateInput?.value;
          const endDate = endDateInput?.value;
          if (startDate && endDate) {
            const start = new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const end = new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            modalDateRange.textContent = `${start} - ${end}`;
          } else {
            modalDateRange.textContent = "All time";
          }
          
          // Show modal
          modal.classList.remove("hidden");
          modal.classList.add("flex");
        } else {
          // Fallback: generate directly if modal elements not found
          generateReport(true); // Show success dialog for user-initiated action
        }
      });

      // Modal handlers
      document.querySelector("[data-cancel-generate]")?.addEventListener("click", () => {
        const modal = document.querySelector("[data-generate-modal]");
        if (modal) {
          modal.classList.add("hidden");
          modal.classList.remove("flex");
        }
      });

      document.querySelector("[data-confirm-generate]")?.addEventListener("click", () => {
        const modal = document.querySelector("[data-generate-modal]");
        if (modal) {
          modal.classList.add("hidden");
          modal.classList.remove("flex");
        }
        generateReport(true); // Show success dialog for user-initiated action
      });

      // Close modal on backdrop click
      document.querySelector("[data-generate-modal]")?.addEventListener("click", (e) => {
        if (e.target === e.currentTarget) {
          const modal = document.querySelector("[data-generate-modal]");
          if (modal) {
            modal.classList.add("hidden");
            modal.classList.remove("flex");
          }
        }
      });

      // Success dialog handlers
      document.querySelector("[data-close-success]")?.addEventListener("click", hideSuccessDialog);
      
      document.querySelector("[data-view-report]")?.addEventListener("click", () => {
        showReportInDialog();
      });
      
      document.querySelector("[data-back-to-summary]")?.addEventListener("click", () => {
        backToSummary();
      });
      
      // Overview download buttons (delegated event listeners)
      document.querySelector("[data-success-dialog]")?.addEventListener("click", (e) => {
        const pdfOverviewBtn = e.target.closest("[data-download-pdf-overview]");
        const csvOverviewBtn = e.target.closest("[data-download-csv-overview]");
        
        if (pdfOverviewBtn) {
          e.stopPropagation();
          const pdfBtn = document.querySelector("[data-export-pdf]");
          if (pdfBtn && !pdfBtn.disabled) {
            pdfBtn.click();
          }
          return;
        }
        
        if (csvOverviewBtn) {
          e.stopPropagation();
          const csvBtn = document.querySelector("[data-export-csv]");
          if (csvBtn && !csvBtn.disabled) {
            csvBtn.click();
          }
          return;
        }
        
        if (e.target === e.currentTarget) {
          hideSuccessDialog();
        }
      });

      // Export buttons
      document.querySelector("[data-export-csv]")?.addEventListener("click", async () => {
        // Disabled buttons won't fire click events, but keeping check for safety
        if (!currentReportData) {
          return;
        }
        try {
          const { type, params } = getExportConfig(currentReportType, startDateInput, endDateInput);
          const apiOrigin = getApiOrigin();
          const url = new URL("/api/reports/export/csv", apiOrigin);
          url.searchParams.set("type", type);
          Object.entries(params || {}).forEach(([key, value]) => {
            if (value) url.searchParams.set(key, value);
          });

          const res = await fetch(url.toString(), {
            headers: {
              Authorization: `Bearer ${getState().token}`,
            },
          });
          if (!res.ok) {
            let errMessage = "Failed to export CSV";
            const contentType = res.headers.get("content-type") || "";
            if (contentType.includes("application/json")) {
              try {
                const errData = await res.json();
                errMessage = errData.message || errMessage;
              } catch {
                errMessage = "Failed to export CSV";
              }
            } else {
              try {
                errMessage = await res.text() || errMessage;
              } catch {
                errMessage = "Failed to export CSV";
              }
            }
            const error = new Error(errMessage);
            error.status = res.status;
            throw error;
          }
          const blob = await res.blob();
          const disposition = res.headers.get("Content-Disposition") || "";
          const match = disposition.match(/filename="(.+?)"/);
          const filename = match ? match[1] : `report-${currentReportType}.csv`;

          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          link.remove();
        } catch (error) {
          console.error("CSV export failed:", error);
          
          // Check if it's an authentication error
          const isAuthError = error.status === 401 || 
                             error.message?.toLowerCase().includes("token") ||
                             error.message?.toLowerCase().includes("unauthorized") ||
                             error.message?.toLowerCase().includes("expired");
          
          if (isAuthError) {
            appActions.clearSession();
            alert("Your session has expired. Please log in again to export reports.");
            window.location.reload();
          } else {
          alert(error.message || "Failed to export CSV. Please try again.");
          }
        }
      });

      document.querySelector("[data-export-pdf]")?.addEventListener("click", async () => {
        // Disabled buttons won't fire click events, but keeping check for safety
        if (!currentReportData) {
          return;
        }
        try {
          const { type, params } = getExportConfig(currentReportType, startDateInput, endDateInput);
          const apiOrigin = getApiOrigin();
          const url = new URL("/api/reports/export/pdf", apiOrigin);
          url.searchParams.set("type", type);
          Object.entries(params || {}).forEach(([key, value]) => {
            if (value) url.searchParams.set(key, value);
          });

          const res = await fetch(url.toString(), {
            headers: {
              Authorization: `Bearer ${getState().token}`,
            },
          });
          if (!res.ok) {
            let errMessage = "Failed to export PDF";
            const contentType = res.headers.get("content-type") || "";
            if (contentType.includes("application/json")) {
              try {
                const errData = await res.json();
                errMessage = errData.message || errMessage;
              } catch {
                errMessage = "Failed to export PDF";
              }
            } else {
              try {
                errMessage = await res.text() || errMessage;
              } catch {
                errMessage = "Failed to export PDF";
              }
            }
            const error = new Error(errMessage);
            error.status = res.status;
            throw error;
          }
          const blob = await res.blob();
          const disposition = res.headers.get("Content-Disposition") || "";
          const match = disposition.match(/filename="(.+?)"/);
          const filename = match ? match[1] : `report-${currentReportType}.pdf`;

          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          link.remove();
        } catch (error) {
          console.error("PDF export failed:", error);
          
          // Check if it's an authentication error
          const isAuthError = error.status === 401 || 
                             error.message?.toLowerCase().includes("token") ||
                             error.message?.toLowerCase().includes("unauthorized") ||
                             error.message?.toLowerCase().includes("expired");
          
          if (isAuthError) {
            appActions.clearSession();
            alert("Your session has expired. Please log in again to export reports.");
            window.location.reload();
          } else {
          alert(error.message || "Failed to export PDF. Please try again.");
          }
        }
      });

      // Initial report
      updateActiveReportType(currentReportType);
      updateExportButtonsState(false); // Start with disabled state
      await generateReport(false); // Don't show success dialog on initial load
    },
  };
}

function getExportConfig(currentReportType, startDateInput, endDateInput) {
  const startDate = startDateInput?.value;
  const endDate = endDateInput?.value;

  switch (currentReportType) {
    case "sales":
      // Use daily sales export by default for sales summary
      return { type: "sales-daily", params: { days: 7 } };
    case "inventory":
      return { type: "low-stock", params: {} };
    case "products":
      return { type: "top-selling", params: { limit: 10 } };
    case "expiring":
      return { type: "expiring", params: { days: 60 } };
    default:
      return { type: "sales-daily", params: { days: 7 } };
  }
}

function getApiOrigin() {
  try {
    const url = new URL(apiClient.baseUrl);
    return url.origin;
  } catch {
    return window.location.origin;
  }
}

function formatCurrency(amount) {
  return `Rs. ${Math.round(amount).toLocaleString('en-PK')}`;
}
