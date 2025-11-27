import { ordersService } from "../../services/ordersService.js";

export function registerOrdersHistoryPage(register) {
  register("orders", ordersHistoryPage);
}

function ordersHistoryPage() {
  return {
    html: `
      <div class="max-w-7xl mx-auto space-y-6">
        <!-- Page Header -->
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 class="text-3xl font-black tracking-tight text-text-primary-light dark:text-text-primary-dark">Order History</h1>
            <p class="text-text-secondary-light dark:text-text-secondary-dark mt-1">View and manage your sales orders.</p>
          </div>
          <button data-route="cart" class="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors shadow-sm">
            <span class="material-symbols-outlined text-lg">add</span>
            New Sale
          </button>
        </div>
        
        <!-- Filters -->
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="relative flex-grow max-w-md">
            <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <span class="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark">search</span>
            </div>
            <input 
              type="text"
              data-search-input
              class="form-input w-full h-11 pl-12 pr-4 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="Search by order ID..."
            />
          </div>
          <input 
            type="date"
            data-date-filter
            class="form-input h-11 px-4 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        
        <!-- Orders Table -->
        <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="border-b border-border-light dark:border-border-dark">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Order ID</th>
                  <th class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Date</th>
                  <th class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Customer</th>
                  <th class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Items</th>
                  <th class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Total</th>
                  <th class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Payment</th>
                  <th class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Status</th>
                  <th class="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Actions</th>
                </tr>
              </thead>
              <tbody data-orders-table class="divide-y divide-border-light dark:divide-border-dark">
                <tr>
                  <td colspan="8" class="px-6 py-12 text-center">
                    <div class="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                    <p class="text-text-secondary-light dark:text-text-secondary-dark">Loading orders...</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `,

    async onMount({ navigate }) {
      const ordersTable = document.querySelector("[data-orders-table]");
      const searchInput = document.querySelector("[data-search-input]");
      const dateFilter = document.querySelector("[data-date-filter]");
      let debounceTimer = null;

      async function loadOrders(filters = {}) {
        try {
          renderLoading();
          const orders = await ordersService.list(filters);
          const orderList = Array.isArray(orders) ? orders : orders.orders || [];
          renderOrders(orderList);
        } catch (error) {
          console.error("Failed to load orders:", error);
          renderError("Failed to load orders. Please try again.");
        }
      }

      function renderLoading() {
        if (!ordersTable) return;
        ordersTable.innerHTML = `
          <tr>
            <td colspan="8" class="px-6 py-12 text-center">
              <div class="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
              <p class="text-text-secondary-light dark:text-text-secondary-dark">Loading orders...</p>
            </td>
          </tr>
        `;
      }

      function renderError(message) {
        if (!ordersTable) return;
        ordersTable.innerHTML = `
          <tr>
            <td colspan="8" class="px-6 py-12 text-center">
              <span class="material-symbols-outlined text-5xl text-danger mb-4 block">error</span>
              <p class="text-text-secondary-light dark:text-text-secondary-dark">${message}</p>
            </td>
          </tr>
        `;
      }

      function renderOrders(orders) {
        if (!ordersTable) return;

        if (!orders.length) {
          ordersTable.innerHTML = `
            <tr>
              <td colspan="8" class="px-6 py-12 text-center">
                <span class="material-symbols-outlined text-5xl text-text-secondary-light dark:text-text-secondary-dark mb-4 block">receipt_long</span>
                <p class="text-lg font-medium text-text-primary-light dark:text-text-primary-dark">No orders found</p>
                <p class="text-text-secondary-light dark:text-text-secondary-dark mt-1">Orders will appear here once you make a sale.</p>
              </td>
            </tr>
          `;
          return;
        }

        ordersTable.innerHTML = orders.map((order) => {
          const date = new Date(order.created_at || order.order_date);
          const formattedDate = date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
          const total = parseFloat(order.total_amount || order.total || 0);
          const status = order.status || "completed";
          const statusClass = status === "completed" ? "bg-success/10 text-success" : "bg-warning/10 text-warning";

          return `
            <tr class="hover:bg-background-light dark:hover:bg-background-dark transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-mono font-medium text-text-primary-light dark:text-text-primary-dark">#${order.id}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-text-secondary-light dark:text-text-secondary-dark">${formattedDate}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-text-primary-light dark:text-text-primary-dark">${order.customer_name || "Walk-in"}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-text-secondary-light dark:text-text-secondary-dark">${order.item_count || order.items?.length || "-"}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">${formatCurrency(total)}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-text-secondary-light dark:text-text-secondary-dark capitalize">${order.payment_method || "Cash"}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center gap-1.5 rounded-full ${statusClass} px-2.5 py-1 text-xs font-medium capitalize">
                  ${status}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <button 
                  data-view-order="${order.id}"
                  class="text-primary text-sm font-medium hover:underline"
                >
                  View Details
                </button>
              </td>
            </tr>
          `;
        }).join("");

        // Attach view handlers
        document.querySelectorAll("[data-view-order]").forEach((btn) => {
          btn.addEventListener("click", () => {
            const orderId = btn.dataset.viewOrder;
            sessionStorage.setItem("gms:activeOrderId", orderId);
            navigate("order-detail");
          });
        });
      }

      // Search with debounce
      searchInput?.addEventListener("input", (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          loadOrders({ search: e.target.value });
        }, 300);
      });

      // Date filter
      dateFilter?.addEventListener("change", (e) => {
        loadOrders({ date: e.target.value });
      });

      // Initial load
      await loadOrders();

      return () => {
        clearTimeout(debounceTimer);
      };
    },
  };
}

function formatCurrency(amount) {
  return `Rs. ${Math.round(amount).toLocaleString('en-PK')}`;
}
