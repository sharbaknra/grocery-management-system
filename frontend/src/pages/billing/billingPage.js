import { billingService } from "../../services/billingService.js";
import { getState } from "../../state/appState.js";

export function registerBillingPage(register) {
  register("billing", billingPage);
}

function billingPage() {
  // Check user role to conditionally show summary statistics
  const userRole = getState().user?.role;
  const isStaff = userRole === "staff";
  
  return {
    html: `
      <div class="max-w-7xl mx-auto space-y-6">
        <!-- Page Header -->
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 class="text-3xl font-black tracking-tight text-text-primary-light dark:text-text-primary-dark">Billing & Invoices</h1>
            <p class="text-text-secondary-light dark:text-text-secondary-dark mt-1">View and manage all sales invoices and billing records.</p>
          </div>
          <div class="flex gap-3">
            <button data-export-csv class="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark font-medium hover:bg-background-light dark:hover:bg-background-dark transition-colors">
              <span class="material-symbols-outlined text-lg">download</span>
              Export CSV
            </button>
          </div>
        </div>
        
        ${!isStaff ? `
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Total Revenue -->
          <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-5">
            <div class="flex items-center justify-between">
              <div class="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                <span class="material-symbols-outlined text-primary text-2xl">payments</span>
              </div>
            </div>
            <div class="mt-4">
              <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">Total Revenue</p>
              <p data-summary="totalRevenue" class="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mt-1">Rs. 0</p>
            </div>
          </div>
          
          <!-- Total Invoices -->
          <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-5">
            <div class="flex items-center justify-between">
              <div class="flex items-center justify-center w-12 h-12 rounded-lg bg-success/10">
                <span class="material-symbols-outlined text-success text-2xl">receipt_long</span>
              </div>
            </div>
            <div class="mt-4">
              <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">Total Invoices</p>
              <p data-summary="totalInvoices" class="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mt-1">0</p>
            </div>
          </div>
          
          <!-- Completed -->
          <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-5">
            <div class="flex items-center justify-between">
              <div class="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-500/10">
                <span class="material-symbols-outlined text-blue-500 text-2xl">check_circle</span>
              </div>
            </div>
            <div class="mt-4">
              <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">Completed</p>
              <p data-summary="completed" class="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mt-1">0</p>
            </div>
          </div>
          
          <!-- Pending -->
          <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-5">
            <div class="flex items-center justify-between">
              <div class="flex items-center justify-center w-12 h-12 rounded-lg bg-warning/10">
                <span class="material-symbols-outlined text-warning text-2xl">pending</span>
              </div>
            </div>
            <div class="mt-4">
              <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">Pending</p>
              <p data-summary="pending" class="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mt-1">0</p>
            </div>
          </div>
        </div>
        ` : ''}
        
        <!-- Filters -->
        <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-4">
          <div class="flex flex-wrap items-center gap-4">
            <!-- Search -->
            <div class="flex-1 min-w-[200px]">
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark">search</span>
                <input 
                  type="text" 
                  data-search
                  placeholder="Search by invoice number or customer..." 
                  class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark placeholder:text-text-secondary-light focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            
            <!-- Status Filter -->
            <select data-filter-status class="px-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark">
              <option value="">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            <!-- Date Filter -->
            <select data-filter-date class="px-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark">
              <option value="">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>
        
        <!-- Invoices Table -->
        <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="border-b border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Invoice #</th>
                  <th class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Customer</th>
                  <th class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Date</th>
                  <th class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Amount</th>
                  <th class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Tax</th>
                  <th class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Status</th>
                  <th class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Actions</th>
                </tr>
              </thead>
              <tbody data-invoices-table class="divide-y divide-border-light dark:divide-border-dark">
                <tr>
                  <td colspan="7" class="px-6 py-12 text-center">
                    <div class="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                    <p class="text-text-secondary-light dark:text-text-secondary-dark">Loading invoices...</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Pagination -->
          <div class="flex items-center justify-between border-t border-border-light dark:border-border-dark px-6 py-4">
            <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              Showing <span data-showing-start>0</span> to <span data-showing-end>0</span> of <span data-total-count>0</span> invoices
            </p>
            <div class="flex gap-1">
              <button data-prev-page class="flex items-center justify-center w-10 h-10 rounded-lg border border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark transition-colors disabled:opacity-50">
                <span class="material-symbols-outlined">chevron_left</span>
              </button>
              <button data-next-page class="flex items-center justify-center w-10 h-10 rounded-lg border border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark transition-colors disabled:opacity-50">
                <span class="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `,

    async onMount({ navigate }) {
      let allInvoices = [];
      let filteredInvoices = [];
      let currentPage = 1;
      const pageSize = 10;

      const searchInput = document.querySelector("[data-search]");
      const statusFilter = document.querySelector("[data-filter-status]");
      const dateFilter = document.querySelector("[data-filter-date]");
      const invoicesTable = document.querySelector("[data-invoices-table]");

      // Load invoices
      async function loadInvoices() {
        try {
          renderLoading();
          const response = await billingService.getInvoices();
          // Handle different response structures
          allInvoices = Array.isArray(response) 
            ? response 
            : (response.data?.orders || response.orders || response.data || []);
          // Ensure it's an array
          if (!Array.isArray(allInvoices)) {
            allInvoices = [];
          }
          applyFilters();
          updateSummary();
        } catch (error) {
          console.error("Failed to load invoices:", error);
          renderError("Failed to load invoices. Please try again.");
        }
      }

      function applyFilters() {
        const searchTerm = searchInput?.value?.toLowerCase() || "";
        const status = statusFilter?.value || "";
        const dateRange = dateFilter?.value || "";

        filteredInvoices = allInvoices.filter(invoice => {
          // Search filter
          const invoiceNum = billingService.generateInvoiceNumber(invoice.order_id, invoice.created_at).toLowerCase();
          const customerName = (invoice.user_name || "").toLowerCase();
          const matchesSearch = !searchTerm || 
            invoiceNum.includes(searchTerm) || 
            customerName.includes(searchTerm);

          // Status filter
          const matchesStatus = !status || invoice.status?.toLowerCase() === status.toLowerCase();

          // Date filter
          let matchesDate = true;
          if (dateRange) {
            const invoiceDate = new Date(invoice.created_at);
            const now = new Date();
            
            switch (dateRange) {
              case "today":
                matchesDate = invoiceDate.toDateString() === now.toDateString();
                break;
              case "week":
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                matchesDate = invoiceDate >= weekAgo;
                break;
              case "month":
                matchesDate = invoiceDate.getMonth() === now.getMonth() && 
                              invoiceDate.getFullYear() === now.getFullYear();
                break;
              case "year":
                matchesDate = invoiceDate.getFullYear() === now.getFullYear();
                break;
            }
          }

          return matchesSearch && matchesStatus && matchesDate;
        });

        currentPage = 1;
        renderInvoices();
      }

      function updateSummary() {
        const totalRevenue = allInvoices.reduce((sum, inv) => sum + parseFloat(inv.total_price || 0), 0);
        const completed = allInvoices.filter(inv => inv.status?.toLowerCase() === "completed").length;
        const pending = allInvoices.filter(inv => inv.status?.toLowerCase() === "pending").length;

        setText("[data-summary='totalRevenue']", billingService.formatCurrency(totalRevenue));
        setText("[data-summary='totalInvoices']", allInvoices.length.toString());
        setText("[data-summary='completed']", completed.toString());
        setText("[data-summary='pending']", pending.toString());
      }

      function renderLoading() {
        if (!invoicesTable) return;
        invoicesTable.innerHTML = `
          <tr>
            <td colspan="7" class="px-6 py-12 text-center">
              <div class="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
              <p class="text-text-secondary-light dark:text-text-secondary-dark">Loading invoices...</p>
            </td>
          </tr>
        `;
      }

      function renderError(message) {
        if (!invoicesTable) return;
        invoicesTable.innerHTML = `
          <tr>
            <td colspan="7" class="px-6 py-12 text-center">
              <span class="material-symbols-outlined text-5xl text-danger mb-4 block">error</span>
              <p class="text-text-secondary-light dark:text-text-secondary-dark">${message}</p>
            </td>
          </tr>
        `;
      }

      function renderInvoices() {
        if (!invoicesTable) return;

        // Pagination
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        const pageInvoices = filteredInvoices.slice(start, end);

        // Update pagination info
        setText("[data-showing-start]", filteredInvoices.length ? (start + 1).toString() : "0");
        setText("[data-showing-end]", Math.min(end, filteredInvoices.length).toString());
        setText("[data-total-count]", filteredInvoices.length.toString());

        if (!pageInvoices.length) {
          invoicesTable.innerHTML = `
            <tr>
              <td colspan="7" class="px-6 py-12 text-center">
                <span class="material-symbols-outlined text-5xl text-text-secondary-light dark:text-text-secondary-dark mb-4 block">receipt_long</span>
                <p class="text-lg font-medium text-text-primary-light dark:text-text-primary-dark">No invoices found</p>
                <p class="text-text-secondary-light dark:text-text-secondary-dark mt-1">Try adjusting your filters</p>
              </td>
            </tr>
          `;
          return;
        }

        invoicesTable.innerHTML = pageInvoices.map(invoice => {
          const invoiceNum = billingService.generateInvoiceNumber(invoice.order_id, invoice.created_at);
          const statusClass = billingService.getStatusClass(invoice.status);
          
          return `
            <tr class="hover:bg-background-light dark:hover:bg-background-dark transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-medium text-primary">${invoiceNum}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <p class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">${invoice.user_name || "Walk-in Customer"}</p>
                  <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark">${invoice.user_email || ""}</p>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-text-secondary-light dark:text-text-secondary-dark">${billingService.formatDateTime(invoice.created_at)}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">${billingService.formatCurrency(invoice.total_price)}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-text-secondary-light dark:text-text-secondary-dark">${billingService.formatCurrency(invoice.tax_applied || 0)}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center gap-1.5 rounded-full ${statusClass} px-2.5 py-1 text-xs font-medium capitalize">
                  ${invoice.status || "Unknown"}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <button 
                    data-view-invoice="${invoice.order_id}"
                    class="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-primary/10 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors"
                    title="View Invoice"
                  >
                    <span class="material-symbols-outlined text-lg">visibility</span>
                  </button>
                  <button 
                    data-print-invoice="${invoice.order_id}"
                    class="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-primary/10 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors"
                    title="Print Invoice"
                  >
                    <span class="material-symbols-outlined text-lg">print</span>
                  </button>
                </div>
              </td>
            </tr>
          `;
        }).join("");

        // Attach event handlers
        attachRowHandlers(navigate);
      }

      function attachRowHandlers(navigate) {
        // View invoice
        document.querySelectorAll("[data-view-invoice]").forEach(btn => {
          btn.addEventListener("click", () => {
            const orderId = btn.dataset.viewInvoice;
            sessionStorage.setItem("gms:activeInvoiceId", orderId);
            navigate("invoice-detail");
          });
        });

        // Print invoice
        document.querySelectorAll("[data-print-invoice]").forEach(btn => {
          btn.addEventListener("click", () => {
            const orderId = btn.dataset.printInvoice;
            sessionStorage.setItem("gms:activeInvoiceId", orderId);
            navigate("invoice-detail");
            // Will trigger print from invoice detail page
            sessionStorage.setItem("gms:printOnLoad", "true");
          });
        });
      }

      // Event listeners
      let debounceTimer;
      searchInput?.addEventListener("input", () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(applyFilters, 300);
      });

      statusFilter?.addEventListener("change", applyFilters);
      dateFilter?.addEventListener("change", applyFilters);

      // Pagination
      document.querySelector("[data-prev-page]")?.addEventListener("click", () => {
        if (currentPage > 1) {
          currentPage--;
          renderInvoices();
        }
      });

      document.querySelector("[data-next-page]")?.addEventListener("click", () => {
        const maxPage = Math.ceil(filteredInvoices.length / pageSize);
        if (currentPage < maxPage) {
          currentPage++;
          renderInvoices();
        }
      });

      // Export CSV
      document.querySelector("[data-export-csv]")?.addEventListener("click", () => {
        exportToCSV(filteredInvoices);
      });

      // Initial load
      await loadInvoices();

      return () => {
        clearTimeout(debounceTimer);
      };
    },
  };
}

function setText(selector, value) {
  const el = document.querySelector(selector);
  if (el) el.textContent = value;
}

function exportToCSV(invoices) {
  const headers = ["Invoice #", "Customer", "Email", "Date", "Amount", "Tax", "Discount", "Status"];
  const rows = invoices.map(inv => [
    billingService.generateInvoiceNumber(inv.order_id, inv.created_at),
    inv.user_name || "Walk-in",
    inv.user_email || "",
    billingService.formatDate(inv.created_at),
    inv.total_price || 0,
    inv.tax_applied || 0,
    inv.discount_applied || 0,
    inv.status || "Unknown",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `invoices-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

