import { cartService } from "../../services/cartService.js";
import { getState, subscribe } from "../../state/appState.js";

export function registerCartPage(register) {
  register("cart", cartPage);
}

function cartPage() {
  return {
    html: `
      <div class="max-w-7xl mx-auto">
        <!-- Page Header -->
        <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 class="text-3xl font-black tracking-tight text-text-primary-light dark:text-text-primary-dark">Your Cart</h1>
            <p class="text-text-secondary-light dark:text-text-secondary-dark mt-1">Review your items before proceeding to checkout.</p>
          </div>
          <button data-route="products" class="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            <span class="material-symbols-outlined text-lg">arrow_back</span>
            Continue Shopping
          </button>
        </div>
        
        <!-- Loading State -->
        <div data-loading class="flex flex-col items-center justify-center py-20">
          <div class="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
          <p class="text-text-secondary-light dark:text-text-secondary-dark">Loading cart...</p>
        </div>
        
        <!-- Empty Cart -->
        <div data-empty-cart class="hidden flex-col items-center justify-center py-20">
          <span class="material-symbols-outlined text-6xl text-text-secondary-light dark:text-text-secondary-dark mb-4">shopping_cart</span>
          <p class="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">Your cart is empty</p>
          <p class="text-text-secondary-light dark:text-text-secondary-dark mt-1">Add some products to get started!</p>
          <button data-route="products" class="mt-6 px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors">
            Browse Products
          </button>
        </div>
        
        <!-- Cart Content -->
        <div data-cart-content class="hidden grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Cart Items -->
          <div class="lg:col-span-2">
            <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead class="bg-background-light dark:bg-background-dark border-b border-border-light dark:border-border-dark">
                    <tr>
                      <th class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark" colspan="2">Product</th>
                      <th class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Quantity</th>
                      <th class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Price</th>
                      <th class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Total</th>
                      <th class="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark"></th>
                    </tr>
                  </thead>
                  <tbody data-cart-items class="divide-y divide-border-light dark:divide-border-dark">
                    <!-- Items will be rendered here -->
                  </tbody>
                </table>
              </div>
              <div class="p-4 border-t border-border-light dark:border-border-dark flex justify-end">
                <button data-clear-cart class="text-sm font-medium text-danger hover:underline">
                  Empty Cart
                </button>
              </div>
            </div>
          </div>
          
          <!-- Order Summary -->
          <div class="lg:col-span-1">
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
              
              <div class="flex justify-between items-center mb-6">
                <span class="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">Total</span>
                <span data-total class="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">Rs. 0</span>
              </div>
              
              <button data-route="checkout" class="w-full py-3 px-4 rounded-lg bg-primary text-white font-bold hover:bg-primary-hover transition-colors">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    `,

    async onMount() {
      const loadingEl = document.querySelector("[data-loading]");
      const emptyEl = document.querySelector("[data-empty-cart]");
      const contentEl = document.querySelector("[data-cart-content]");
      const cartItemsEl = document.querySelector("[data-cart-items]");

      let unsubscribe = null;

      function showLoading() {
        loadingEl?.classList.remove("hidden");
        loadingEl?.classList.add("flex");
        emptyEl?.classList.add("hidden");
        contentEl?.classList.add("hidden");
      }

      function showEmpty() {
        loadingEl?.classList.add("hidden");
        emptyEl?.classList.remove("hidden");
        emptyEl?.classList.add("flex");
        contentEl?.classList.add("hidden");
      }

      function showContent() {
        loadingEl?.classList.add("hidden");
        emptyEl?.classList.add("hidden");
        contentEl?.classList.remove("hidden");
        contentEl?.classList.add("grid");
      }

      async function loadCart() {
        try {
          showLoading();
          const cart = await cartService.getCart();
          renderCart(cart);
        } catch (error) {
          console.error("Failed to load cart:", error);
          showEmpty();
        }
      }

      function renderCart(cart) {
        const items = cart?.items || [];
        
        if (!items.length) {
          showEmpty();
          return;
        }

        showContent();
        renderCartItems(items);
        updateSummary(items);
        attachItemHandlers();
      }

      function renderCartItems(items) {
        if (!cartItemsEl) return;

        cartItemsEl.innerHTML = items.map((item) => {
          const price = parseFloat(item.price) || 0;
          const quantity = item.quantity || 1;
          const total = price * quantity;
          const imageUrl = item.image_url || item.product_image || "https://via.placeholder.com/64x64?text=No+Image";

          return `
            <tr class="hover:bg-background-light dark:hover:bg-background-dark transition-colors" data-item-row="${item.product_id || item.id}">
              <td class="px-6 py-4 whitespace-nowrap">
                <div 
                  class="w-16 h-16 rounded-lg bg-center bg-cover bg-no-repeat bg-background-light dark:bg-background-dark"
                  style="background-image: url('${imageUrl}')"
                ></div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">${item.name || item.product_name}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <button 
                    data-decrease="${item.product_id || item.id}"
                    class="flex items-center justify-center w-8 h-8 rounded-full border border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark transition-colors"
                  >-</button>
                  <input 
                    type="number" 
                    value="${quantity}" 
                    min="1"
                    data-quantity-input="${item.product_id || item.id}"
                    class="w-14 h-8 rounded border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-center text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                  <button 
                    data-increase="${item.product_id || item.id}"
                    class="flex items-center justify-center w-8 h-8 rounded-full border border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark transition-colors"
                  >+</button>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-text-secondary-light dark:text-text-secondary-dark">$${price.toFixed(2)}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary-light dark:text-text-primary-dark">$${total.toFixed(2)}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <button 
                  data-remove="${item.product_id || item.id}"
                  class="text-danger hover:text-red-700 transition-colors"
                >
                  <span class="material-symbols-outlined">delete</span>
                </button>
              </td>
            </tr>
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

      function attachItemHandlers() {
        // Decrease quantity
        document.querySelectorAll("[data-decrease]").forEach((btn) => {
          btn.addEventListener("click", async () => {
            const productId = btn.dataset.decrease;
            const input = document.querySelector(`[data-quantity-input="${productId}"]`);
            const currentQty = parseInt(input?.value) || 1;
            if (currentQty > 1) {
              await updateQuantity(productId, currentQty - 1);
            }
          });
        });

        // Increase quantity
        document.querySelectorAll("[data-increase]").forEach((btn) => {
          btn.addEventListener("click", async () => {
            const productId = btn.dataset.increase;
            const input = document.querySelector(`[data-quantity-input="${productId}"]`);
            const currentQty = parseInt(input?.value) || 1;
            await updateQuantity(productId, currentQty + 1);
          });
        });

        // Manual quantity input
        document.querySelectorAll("[data-quantity-input]").forEach((input) => {
          input.addEventListener("change", async (e) => {
            const productId = input.dataset.quantityInput;
            const newQty = parseInt(e.target.value) || 1;
            if (newQty >= 1) {
              await updateQuantity(productId, newQty);
            }
          });
        });

        // Remove item
        document.querySelectorAll("[data-remove]").forEach((btn) => {
          btn.addEventListener("click", async () => {
            const productId = btn.dataset.remove;
            await removeItem(productId);
          });
        });

        // Clear cart
        document.querySelector("[data-clear-cart]")?.addEventListener("click", async () => {
          if (!confirm("Are you sure you want to empty your cart?")) return;
          try {
            await cartService.clearCart();
            showEmpty();
          } catch (error) {
            console.error("Failed to clear cart:", error);
          }
        });
      }

      async function updateQuantity(productId, quantity) {
        try {
          await cartService.updateItem(productId, { quantity });
          await loadCart();
        } catch (error) {
          console.error("Failed to update quantity:", error);
        }
      }

      async function removeItem(productId) {
        try {
          await cartService.removeItem(productId);
          await loadCart();
        } catch (error) {
          console.error("Failed to remove item:", error);
        }
      }

      // Subscribe to state changes
      unsubscribe = subscribe((state) => {
        if (state.cart) {
          renderCart(state.cart);
        }
      });

      // Initial load
      await loadCart();

      return () => {
        if (unsubscribe) unsubscribe();
      };
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
