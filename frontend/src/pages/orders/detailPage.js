import { ordersService } from "../../services/ordersService.js";

export function registerOrderDetailPage(register) {
  register("order-detail", orderDetailPage);
}

function orderDetailPage() {
  return {
    html: `
      <div class="max-w-4xl mx-auto">
        <!-- Breadcrumbs -->
        <nav class="flex items-center gap-2 mb-6 text-sm">
          <button data-route="orders" class="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors">Orders</button>
          <span class="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark text-base">chevron_right</span>
          <span data-order-id class="text-text-primary-light dark:text-text-primary-dark font-medium">#0000</span>
        </nav>
        
        <!-- Loading State -->
        <div data-loading class="flex flex-col items-center justify-center py-20">
          <div class="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
          <p class="text-text-secondary-light dark:text-text-secondary-dark">Loading order details...</p>
        </div>
        
        <!-- Error State -->
        <div data-error class="hidden flex-col items-center justify-center py-20">
          <span class="material-symbols-outlined text-6xl text-danger mb-4">error</span>
          <p class="text-lg font-medium text-text-primary-light dark:text-text-primary-dark">Failed to load order</p>
          <p data-error-message class="text-text-secondary-light dark:text-text-secondary-dark mt-1">Please try again later.</p>
          <button data-route="orders" class="mt-6 px-6 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors">
            Back to Orders
          </button>
        </div>
        
        <!-- Order Content -->
        <div data-order-content class="hidden space-y-6">
          <!-- Header -->
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 class="text-3xl font-black tracking-tight text-text-primary-light dark:text-text-primary-dark">
                Order <span data-order-title>#0000</span>
              </h1>
              <p data-order-date class="text-text-secondary-light dark:text-text-secondary-dark mt-1">Placed on -</p>
            </div>
            <div class="flex items-center gap-3">
              <span data-order-status class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium">
                Completed
              </span>
              <button data-print class="flex items-center gap-2 px-4 py-2 rounded-lg border border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark font-medium hover:bg-background-light dark:hover:bg-background-dark transition-colors">
                <span class="material-symbols-outlined text-lg">print</span>
                Print Receipt
              </button>
            </div>
          </div>
          
          <!-- Order Info Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Customer Info -->
            <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6">
              <h3 class="text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-4">Customer Information</h3>
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <span class="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark">person</span>
                  <span data-customer-name class="text-text-primary-light dark:text-text-primary-dark">Walk-in Customer</span>
                </div>
                <div class="flex items-center gap-3">
                  <span class="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark">phone</span>
                  <span data-customer-phone class="text-text-primary-light dark:text-text-primary-dark">-</span>
                </div>
              </div>
            </div>
            
            <!-- Payment Info -->
            <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6">
              <h3 class="text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-4">Payment Information</h3>
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <span class="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark">payments</span>
                  <span data-payment-method class="text-text-primary-light dark:text-text-primary-dark capitalize">Cash</span>
                </div>
                <div class="flex items-center gap-3">
                  <span class="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark">account_circle</span>
                  <span data-cashier class="text-text-primary-light dark:text-text-primary-dark">-</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Order Items -->
          <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
            <div class="px-6 py-4 border-b border-border-light dark:border-border-dark">
              <h3 class="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">Order Items</h3>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-background-light dark:bg-background-dark">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Product</th>
                    <th class="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Quantity</th>
                    <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Unit Price</th>
                    <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Total</th>
                  </tr>
                </thead>
                <tbody data-items-table class="divide-y divide-border-light dark:divide-border-dark">
                  <tr>
                    <td colspan="4" class="px-6 py-8 text-center text-text-secondary-light dark:text-text-secondary-dark">
                      No items found.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <!-- Order Summary -->
          <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6">
            <h3 class="text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-4">Order Summary</h3>
            <div class="space-y-3 max-w-xs ml-auto">
              <div class="flex justify-between items-center">
                <span class="text-text-secondary-light dark:text-text-secondary-dark">Subtotal</span>
                <span data-subtotal class="font-medium text-text-primary-light dark:text-text-primary-dark">Rs. 0</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-text-secondary-light dark:text-text-secondary-dark">GST</span>
                <span data-tax class="font-medium text-text-primary-light dark:text-text-primary-dark">Rs. 0</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-text-secondary-light dark:text-text-secondary-dark">Discount</span>
                <span data-discount class="font-medium text-success">-Rs. 0</span>
              </div>
              <div class="border-t border-border-light dark:border-border-dark pt-3">
                <div class="flex justify-between items-center">
                  <span class="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">Total</span>
                  <span data-total class="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">Rs. 0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,

    async onMount() {
      const orderId = sessionStorage.getItem("gms:activeOrderId");
      
      const loadingEl = document.querySelector("[data-loading]");
      const errorEl = document.querySelector("[data-error]");
      const contentEl = document.querySelector("[data-order-content]");

      if (!orderId) {
        showError("No order selected");
        return;
      }

      function showLoading() {
        loadingEl?.classList.remove("hidden");
        loadingEl?.classList.add("flex");
        errorEl?.classList.add("hidden");
        contentEl?.classList.add("hidden");
      }

      function showError(message) {
        loadingEl?.classList.add("hidden");
        errorEl?.classList.remove("hidden");
        errorEl?.classList.add("flex");
        contentEl?.classList.add("hidden");
        const msgEl = document.querySelector("[data-error-message]");
        if (msgEl) msgEl.textContent = message;
      }

      function showContent() {
        loadingEl?.classList.add("hidden");
        errorEl?.classList.add("hidden");
        contentEl?.classList.remove("hidden");
      }

      try {
        showLoading();
        const response = await ordersService.getById(orderId);
        // Handle response structure: { success: true, data: { order: {...} } }
        const order = response?.data?.order || response?.order || response;
        renderOrder(order);
        showContent();
      } catch (error) {
        console.error("Failed to load order:", error);
        showError(error.message || "Failed to load order details");
      }

      // Print button
      document.querySelector("[data-print]")?.addEventListener("click", () => {
        window.print();
      });
    },
  };
}

function renderOrder(order) {
  if (!order) {
    console.error("Order data is missing");
    return;
  }

  // Header - handle both id and order_id
  const orderId = order.id || order.order_id;
  setText("[data-order-id]", `#${orderId}`);
  setText("[data-order-title]", `#${orderId}`);
  
  const date = new Date(order.created_at || order.order_date);
  setText("[data-order-date]", `Placed on ${date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })}`);

  // Status
  const statusEl = document.querySelector("[data-order-status]");
  if (statusEl) {
    const rawStatus = (order.status || "completed").toString().toLowerCase();
    const statusClass = rawStatus === "completed"
      ? "bg-success/10 text-success"
      : rawStatus === "pending"
        ? "bg-warning/10 text-warning"
        : "bg-danger/10 text-danger";
    statusEl.className = `inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ${statusClass}`;
    statusEl.textContent = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1);
  }

  // Customer Info
  setText("[data-customer-name]", order.customer_name || "Walk-in Customer");
  setText("[data-customer-phone]", order.customer_phone || "-");

  // Payment Info
  setText("[data-payment-method]", order.payment_method || "Cash");
  setText("[data-cashier]", order.cashier_name || order.user_name || "-");

  // Order Items
  const items = order.items || order.order_items || [];
  renderItems(items);

  // Summary
  const subtotal = items.reduce((sum, item) => {
    const price = parseFloat(item.price || item.unit_price || item.unit_price_at_sale) || 0;
    const qty = item.quantity || 1;
    return sum + (price * qty);
  }, 0);
  
  const tax = parseFloat(order.tax || order.tax_applied) || subtotal * 0.08;
  const discount = parseFloat(order.discount || order.discount_applied) || 0;
  const total = parseFloat(order.total_amount || order.total || order.total_price) || (subtotal + tax - discount);

  setText("[data-subtotal]", formatCurrency(subtotal));
  setText("[data-tax]", formatCurrency(tax));
  setText("[data-discount]", `-${formatCurrency(discount)}`);
  setText("[data-total]", formatCurrency(total));
}

function renderItems(items) {
  const tbody = document.querySelector("[data-items-table]");
  if (!tbody) return;

  if (!items.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="px-6 py-8 text-center text-text-secondary-light dark:text-text-secondary-dark">
          No items found.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = items.map((item) => {
    const price = parseFloat(item.price || item.unit_price || item.unit_price_at_sale) || 0;
    const qty = item.quantity || 1;
    const total = price * qty;

    return `
      <tr class="hover:bg-background-light dark:hover:bg-background-dark transition-colors">
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">${item.name || item.product_name || 'Unknown Product'}</span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-center">
          <span class="text-sm text-text-primary-light dark:text-text-primary-dark">${qty}</span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-right">
          <span class="text-sm text-text-secondary-light dark:text-text-secondary-dark">${formatCurrency(price)}</span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-right">
          <span class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">${formatCurrency(total)}</span>
        </td>
      </tr>
    `;
  }).join("");
}

function setText(selector, value) {
  const el = document.querySelector(selector);
  if (el) el.textContent = value;
}

function formatCurrency(amount) {
  return `Rs. ${Math.round(amount).toLocaleString('en-PK')}`;
}
