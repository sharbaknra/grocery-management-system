import { cartService } from "../../services/cartService.js";
import { ordersService } from "../../services/ordersService.js";
import { getState } from "../../state/appState.js";

export function registerCheckoutPage(register) {
  register("checkout", checkoutPage);
}

function checkoutPage() {
  return {
    html: `
      <div class="max-w-6xl mx-auto">
        <!-- Page Header -->
        <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 class="text-3xl font-black tracking-tight text-text-primary-light dark:text-text-primary-dark">Checkout</h1>
            <p class="text-text-secondary-light dark:text-text-secondary-dark mt-1">Review your order and select a payment method to complete the sale.</p>
          </div>
        </div>
        
        <!-- Loading State -->
        <div data-loading class="flex flex-col items-center justify-center py-20">
          <div class="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
          <p class="text-text-secondary-light dark:text-text-secondary-dark">Loading checkout...</p>
        </div>
        
        <!-- Checkout Content -->
        <div data-checkout-content class="hidden grid grid-cols-1 lg:grid-cols-5 gap-8">
          <!-- Left Column -->
          <div class="lg:col-span-3 space-y-6">
            <!-- Order Review -->
            <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6">
              <h2 class="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">Order Review</h2>
              <div data-order-items class="flex flex-col gap-3 max-h-96 overflow-y-auto pr-2">
                <!-- Items will be rendered here -->
              </div>
            </div>
            
            <!-- Payment Method -->
            <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6">
              <h2 class="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">Payment Method</h2>
              <div class="flex flex-col gap-3">
                <label class="flex items-center p-4 rounded-lg border border-border-light dark:border-border-dark cursor-pointer hover:border-primary transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <input type="radio" name="payment_method" value="cash" checked class="form-radio h-4 w-4 text-primary focus:ring-primary" />
                  <span class="ml-3 font-medium text-text-primary-light dark:text-text-primary-dark">Cash</span>
                </label>
                <label class="flex items-center p-4 rounded-lg border border-border-light dark:border-border-dark cursor-pointer hover:border-primary transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <input type="radio" name="payment_method" value="card" class="form-radio h-4 w-4 text-primary focus:ring-primary" />
                  <span class="ml-3 font-medium text-text-primary-light dark:text-text-primary-dark">Credit/Debit Card</span>
                </label>
                <label class="flex items-center p-4 rounded-lg border border-border-light dark:border-border-dark cursor-pointer hover:border-primary transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <input type="radio" name="payment_method" value="mobile" class="form-radio h-4 w-4 text-primary focus:ring-primary" />
                  <span class="ml-3 font-medium text-text-primary-light dark:text-text-primary-dark">Mobile Payment</span>
                </label>
              </div>
            </div>
            
            <!-- Customer Info (Optional) -->
            <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6">
              <h2 class="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">Customer Info (Optional)</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2 block">Customer Name</label>
                  <input 
                    type="text"
                    name="customer_name"
                    class="form-input w-full h-11 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark focus:border-primary focus:ring-2 focus:ring-primary/20 px-4"
                    placeholder="Enter customer name"
                  />
                </div>
                <div>
                  <label class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2 block">Phone Number</label>
                  <input 
                    type="tel"
                    name="customer_phone"
                    class="form-input w-full h-11 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark focus:border-primary focus:ring-2 focus:ring-primary/20 px-4"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <!-- Right Column - Order Summary -->
          <div class="lg:col-span-2">
            <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6 sticky top-24">
              <h2 class="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6">Order Summary</h2>
              
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <span class="text-text-secondary-light dark:text-text-secondary-dark">Subtotal</span>
                  <span data-subtotal class="font-medium text-text-primary-light dark:text-text-primary-dark">Rs. 0</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-text-secondary-light dark:text-text-secondary-dark">GST (17%)</span>
                  <span data-tax class="font-medium text-text-primary-light dark:text-text-primary-dark">Rs. 0</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-text-secondary-light dark:text-text-secondary-dark">Discount</span>
                  <span data-discount class="font-medium text-success">-Rs. 0</span>
                </div>
              </div>
              
              <div class="border-t border-border-light dark:border-border-dark my-6"></div>
              
              <div class="flex justify-between items-center mb-8">
                <span class="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">Grand Total</span>
                <span data-total class="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">Rs. 0</span>
              </div>
              
              <!-- Status Message -->
              <div data-checkout-status class="hidden items-center gap-3 rounded-lg p-4 text-sm mb-4">
                <span class="material-symbols-outlined text-lg">info</span>
                <p class="font-medium"></p>
              </div>
              
              <div class="flex flex-col gap-3">
                <button 
                  data-confirm-order
                  class="w-full py-3 px-4 rounded-lg bg-primary text-white font-bold hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Order
                </button>
                <button 
                  data-route="cart"
                  class="w-full py-3 px-4 rounded-lg border border-danger text-danger font-bold hover:bg-danger/10 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Success Modal -->
        <div data-success-modal class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div class="bg-surface-light dark:bg-surface-dark rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
            <div class="flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mx-auto mb-4">
              <span class="material-symbols-outlined text-success text-4xl">check_circle</span>
            </div>
            <h3 class="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">Order Confirmed!</h3>
            <p class="text-text-secondary-light dark:text-text-secondary-dark mb-6">Your order has been successfully placed.</p>
            <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-6">Order ID: <span data-order-id class="font-mono font-bold text-text-primary-light dark:text-text-primary-dark">#0000</span></p>
            <div class="flex gap-3">
              <button data-print-receipt class="flex-1 py-3 px-4 rounded-lg bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark font-medium hover:bg-border-light dark:hover:bg-border-dark transition-colors">
                <span class="material-symbols-outlined text-sm mr-1">print</span>
                Print Receipt
              </button>
              <button data-new-sale class="flex-1 py-3 px-4 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors">
                New Sale
              </button>
            </div>
          </div>
        </div>
      </div>
    `,

    async onMount({ navigate }) {
      const loadingEl = document.querySelector("[data-loading]");
      const contentEl = document.querySelector("[data-checkout-content]");
      const orderItemsEl = document.querySelector("[data-order-items]");
      const confirmBtn = document.querySelector("[data-confirm-order]");
      const statusEl = document.querySelector("[data-checkout-status]");
      const successModal = document.querySelector("[data-success-modal]");

      let cartItems = [];

      function showLoading() {
        loadingEl?.classList.remove("hidden");
        loadingEl?.classList.add("flex");
        contentEl?.classList.add("hidden");
      }

      function showContent() {
        loadingEl?.classList.add("hidden");
        contentEl?.classList.remove("hidden");
        contentEl?.classList.add("grid");
      }

      function showStatus(message, type = "info") {
        if (!statusEl) return;
        statusEl.classList.remove("hidden", "bg-red-50", "text-red-600", "bg-green-50", "text-green-600", "bg-blue-50", "text-blue-600", "dark:bg-red-900/20", "dark:text-red-400", "dark:bg-green-900/20", "dark:text-green-400", "dark:bg-blue-900/20", "dark:text-blue-400");
        statusEl.classList.add("flex");
        
        const icon = statusEl.querySelector(".material-symbols-outlined");
        const text = statusEl.querySelector("p");
        
        if (type === "error") {
          statusEl.classList.add("bg-red-50", "text-red-600", "dark:bg-red-900/20", "dark:text-red-400");
          if (icon) icon.textContent = "error";
        } else if (type === "success") {
          statusEl.classList.add("bg-green-50", "text-green-600", "dark:bg-green-900/20", "dark:text-green-400");
          if (icon) icon.textContent = "check_circle";
        } else {
          statusEl.classList.add("bg-blue-50", "text-blue-600", "dark:bg-blue-900/20", "dark:text-blue-400");
          if (icon) icon.textContent = "info";
        }
        
        if (text) text.textContent = message;
      }

      async function loadCheckout() {
        try {
          showLoading();
          const cart = await cartService.getCart();
          cartItems = cart?.items || [];
          
          if (!cartItems.length) {
            navigate("cart");
            return;
          }

          renderOrderItems(cartItems);
          updateSummary(cartItems);
          showContent();
        } catch (error) {
          console.error("Failed to load checkout:", error);
          navigate("cart");
        }
      }

      function renderOrderItems(items) {
        if (!orderItemsEl) return;

        orderItemsEl.innerHTML = items.map((item) => {
          const price = parseFloat(item.price) || 0;
          const quantity = item.quantity || 1;
          const total = price * quantity;
          const imageUrl = item.image_url || item.product_image || "https://via.placeholder.com/56x56?text=No+Image";

          return `
            <div class="flex items-center gap-4 bg-background-light dark:bg-background-dark p-4 rounded-lg">
              <div 
                class="w-14 h-14 rounded-lg bg-center bg-cover bg-no-repeat shrink-0"
                style="background-image: url('${imageUrl}')"
              ></div>
              <div class="flex-grow">
                <p class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">${item.name || item.product_name}</p>
                <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">$${price.toFixed(2)} × ${quantity}</p>
              </div>
              <p class="font-medium text-text-primary-light dark:text-text-primary-dark">$${total.toFixed(2)}</p>
            </div>
          `;
        }).join("");
      }

      function updateSummary(items) {
        const subtotal = items.reduce((sum, item) => {
          const price = parseFloat(item.price) || 0;
          const quantity = item.quantity || 1;
          return sum + (price * quantity);
        }, 0);

        const taxRate = 0.17; // 17% GST Pakistan
        const tax = subtotal * taxRate;
        const discount = 0;
        const total = subtotal + tax - discount;

        setText("[data-subtotal]", formatCurrency(subtotal));
        setText("[data-tax]", formatCurrency(tax));
        setText("[data-discount]", `-${formatCurrency(discount)}`);
        setText("[data-total]", formatCurrency(total));
      }

      // Confirm order handler
      confirmBtn?.addEventListener("click", async () => {
        const paymentMethod = document.querySelector('input[name="payment_method"]:checked')?.value || "cash";
        const customerName = document.querySelector('input[name="customer_name"]')?.value || "";
        const customerPhone = document.querySelector('input[name="customer_phone"]')?.value || "";

        try {
          confirmBtn.disabled = true;
          confirmBtn.innerHTML = '<span class="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Processing...';
          showStatus("Processing your order...", "info");

          const orderData = {
            payment_method: paymentMethod,
            customer_name: customerName,
            customer_phone: customerPhone,
          };

          const result = await ordersService.checkout(orderData);
          
          // Show success modal
          const orderIdEl = document.querySelector("[data-order-id]");
          if (orderIdEl) orderIdEl.textContent = `#${result.order_id || result.id || "0000"}`;
          successModal?.classList.remove("hidden");
          successModal?.classList.add("flex");

        } catch (error) {
          console.error("Checkout failed:", error);
          showStatus(error.message || "Failed to process order. Please try again.", "error");
          confirmBtn.disabled = false;
          confirmBtn.innerHTML = "Confirm Order";
        }
      });

      // Success modal handlers
      document.querySelector("[data-print-receipt]")?.addEventListener("click", () => {
        window.print();
      });

      document.querySelector("[data-new-sale]")?.addEventListener("click", () => {
        successModal?.classList.add("hidden");
        navigate("products");
      });

      // Initial load
      await loadCheckout();
    },
  };
}

function setText(selector, value) {
  const el = document.querySelector(selector);
  if (el) el.textContent = value;
}

function formatCurrency(amount) {
  return `Rs. ${Math.round(amount).toLocaleString('en-PK')}`;
}
