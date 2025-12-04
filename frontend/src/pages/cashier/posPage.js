import { productsService } from "../../services/productsService.js";
import { cartService } from "../../services/cartService.js";
import { ordersService } from "../../services/ordersService.js";
import { getImageUrl } from "../../services/apiClient.js";

export function registerPosPage(register) {
  register("pos", posPage);
}

function posPage() {
  return {
    html: `
      <div class="h-[calc(100vh-120px)] flex gap-6">
        <!-- Products Section -->
        <div class="flex-1 flex flex-col bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
          <!-- Search & Filters -->
          <div class="p-4 border-b border-border-light dark:border-border-dark">
            <div class="flex gap-4">
              <div class="flex-1 relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark">search</span>
                <input 
                  type="text" 
                  data-search-input
                  placeholder="Search products by name or barcode..." 
                  class="w-full pl-10 pr-4 py-3 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark placeholder:text-text-secondary-light focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <select data-category-filter class="px-4 py-3 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark">
                <option value="">All Categories</option>
                <option value="fruits">Fruits</option>
                <option value="vegetables">Vegetables</option>
                <option value="dairy">Dairy</option>
                <option value="bakery">Bakery</option>
                <option value="meat">Meat</option>
                <option value="beverages">Beverages</option>
                <option value="spices">Spices</option>
                <option value="pulses">Pulses & Grains</option>
                <option value="rice">Rice & Flour</option>
                <option value="snacks">Snacks</option>
              </select>
            </div>
          </div>
          
          <!-- Products Grid -->
          <div data-products-grid class="flex-1 overflow-y-auto p-4">
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              <!-- Products will be loaded here -->
            </div>
          </div>
        </div>
        
        <!-- Cart Section -->
        <div class="w-96 flex flex-col bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
          <!-- Cart Header -->
          <div class="p-4 border-b border-border-light dark:border-border-dark">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-primary">shopping_cart</span>
                <h2 class="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">Current Sale</h2>
              </div>
              <button data-clear-cart class="text-sm text-danger hover:underline">Clear All</button>
            </div>
          </div>
          
          <!-- Cart Items -->
          <div data-cart-items class="flex-1 overflow-y-auto p-4">
            <div class="text-center py-12 text-text-secondary-light dark:text-text-secondary-dark">
              <span class="material-symbols-outlined text-5xl mb-3 block">add_shopping_cart</span>
              <p class="font-medium">No items in cart</p>
              <p class="text-sm mt-1">Click on products to add them</p>
            </div>
          </div>
          
          <!-- Cart Summary -->
          <div class="p-4 border-t border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark">
            <div class="space-y-2 mb-4">
              <div class="flex justify-between text-sm">
                <span class="text-text-secondary-light dark:text-text-secondary-dark">Subtotal</span>
                <span data-subtotal class="text-text-primary-light dark:text-text-primary-dark font-medium">Rs. 0</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-text-secondary-light dark:text-text-secondary-dark">Tax (0%)</span>
                <span data-tax class="text-text-primary-light dark:text-text-primary-dark font-medium">Rs. 0</span>
              </div>
              <div class="flex justify-between text-lg font-bold pt-2 border-t border-border-light dark:border-border-dark">
                <span class="text-text-primary-light dark:text-text-primary-dark">Total</span>
                <span data-total class="text-primary">Rs. 0</span>
              </div>
            </div>
            
            <!-- Payment Method -->
            <div class="mb-4">
              <label class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark block mb-2">Payment Method</label>
              <div class="grid grid-cols-2 gap-2">
                <button data-payment="cash" class="payment-btn active flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-primary bg-primary/10 text-primary font-medium">
                  <span class="material-symbols-outlined text-lg">payments</span>
                  Cash
                </button>
                <button data-payment="card" class="payment-btn flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark font-medium hover:border-primary hover:text-primary transition-colors">
                  <span class="material-symbols-outlined text-lg">credit_card</span>
                  Card
                </button>
              </div>
            </div>
            
            <!-- Checkout Button -->
            <button data-checkout class="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <span class="material-symbols-outlined">point_of_sale</span>
              Complete Sale
            </button>
          </div>
        </div>
      </div>
      
      <!-- Success Modal -->
      <div data-success-modal class="fixed inset-0 z-50 hidden">
        <div class="absolute inset-0 bg-black/50"></div>
        <div class="absolute inset-0 flex items-center justify-center p-4">
          <div class="bg-surface-light dark:bg-surface-dark rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
            <div class="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="material-symbols-outlined text-5xl text-success">check_circle</span>
            </div>
            <h3 class="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">Sale Complete!</h3>
            <p class="text-text-secondary-light dark:text-text-secondary-dark mb-2">Order #<span data-order-id>---</span></p>
            <p class="text-3xl font-bold text-primary mb-6" data-order-total>Rs. 0</p>
            <div class="flex gap-3">
              <button data-print-receipt class="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-border-light dark:border-border-dark rounded-lg font-medium hover:bg-background-light dark:hover:bg-background-dark transition-colors">
                <span class="material-symbols-outlined">print</span>
                Print Receipt
              </button>
              <button data-new-sale class="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors">
                <span class="material-symbols-outlined">add</span>
                New Sale
              </button>
            </div>
          </div>
        </div>
      </div>
    `,

    async onMount({ navigate }) {
      let products = [];
      let cart = [];
      let selectedPayment = "cash";
      
      const searchInput = document.querySelector("[data-search-input]");
      const categoryFilter = document.querySelector("[data-category-filter]");
      const productsGrid = document.querySelector("[data-products-grid]");
      const cartItems = document.querySelector("[data-cart-items]");
      const checkoutBtn = document.querySelector("[data-checkout]");
      const clearCartBtn = document.querySelector("[data-clear-cart]");
      const successModal = document.querySelector("[data-success-modal]");
      
      // Load products
      async function loadProducts(search = "", category = "") {
        try {
          productsGrid.innerHTML = `
            <div class="col-span-full text-center py-12">
              <div class="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
              <p class="text-text-secondary-light dark:text-text-secondary-dark">Loading products...</p>
            </div>
          `;
          
          const params = {};
          if (search) params.name = search;
          if (category) params.category = category;
          
          const response = await productsService.list(params);
          products = Array.isArray(response) ? response : (response.products || response.data || []);
          
          // Filter only in-stock items
          products = products.filter(p => (p.stock_quantity || p.quantity || 0) > 0);
          
          renderProducts();
        } catch (error) {
          console.error("Failed to load products:", error);
          productsGrid.innerHTML = `
            <div class="col-span-full text-center py-12 text-danger">
              <span class="material-symbols-outlined text-5xl mb-3 block">error</span>
              <p>Failed to load products</p>
            </div>
          `;
        }
      }
      
      function renderProducts() {
        if (!products.length) {
          productsGrid.innerHTML = `
            <div class="col-span-full text-center py-12 text-text-secondary-light dark:text-text-secondary-dark">
              <span class="material-symbols-outlined text-5xl mb-3 block">inventory_2</span>
              <p>No products found</p>
            </div>
          `;
          return;
        }
        
        productsGrid.innerHTML = `
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            ${products.map(product => {
              const stock = product.stock_quantity || product.quantity || 0;
              const imageUrl = getImageUrl(product.image_url || product.image);
              
              return `
                <button 
                  data-add-product="${product.id}"
                  class="flex flex-col bg-background-light dark:bg-background-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden hover:border-primary hover:shadow-lg transition-all group"
                >
                  <div class="aspect-square bg-neutral/10 overflow-hidden">
                    <img src="${imageUrl}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform" onerror="this.src='https://via.placeholder.com/200?text=No+Image'" />
                  </div>
                  <div class="p-3 text-left">
                    <h4 class="font-medium text-text-primary-light dark:text-text-primary-dark text-sm truncate">${product.name}</h4>
                    <p class="text-primary font-bold mt-1">Rs. ${parseFloat(product.price).toLocaleString()}</p>
                    <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">${stock} in stock</p>
                  </div>
                </button>
              `;
            }).join("")}
          </div>
        `;
        
        // Attach click handlers
        productsGrid.querySelectorAll("[data-add-product]").forEach(btn => {
          btn.addEventListener("click", () => {
            const productId = parseInt(btn.dataset.addProduct);
            addToCart(productId);
          });
        });
      }
      
      function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        const existingItem = cart.find(item => item.product.id === productId);
        const stock = product.stock_quantity || product.quantity || 0;
        
        if (existingItem) {
          if (existingItem.quantity < stock) {
            existingItem.quantity++;
          } else {
            alert("Cannot add more - stock limit reached");
            return;
          }
        } else {
          cart.push({ product, quantity: 1 });
        }
        
        renderCart();
      }
      
      function removeFromCart(productId) {
        cart = cart.filter(item => item.product.id !== productId);
        renderCart();
      }
      
      function updateQuantity(productId, delta) {
        const item = cart.find(i => i.product.id === productId);
        if (!item) return;
        
        const stock = item.product.stock_quantity || item.product.quantity || 0;
        const newQty = item.quantity + delta;
        
        if (newQty <= 0) {
          removeFromCart(productId);
        } else if (newQty <= stock) {
          item.quantity = newQty;
          renderCart();
        } else {
          alert("Cannot add more - stock limit reached");
        }
      }
      
      function renderCart() {
        if (!cart.length) {
          cartItems.innerHTML = `
            <div class="text-center py-12 text-text-secondary-light dark:text-text-secondary-dark">
              <span class="material-symbols-outlined text-5xl mb-3 block">add_shopping_cart</span>
              <p class="font-medium">No items in cart</p>
              <p class="text-sm mt-1">Click on products to add them</p>
            </div>
          `;
          updateTotals();
          return;
        }
        
        cartItems.innerHTML = cart.map(item => `
          <div class="flex items-center gap-3 p-3 bg-background-light dark:bg-background-dark rounded-lg mb-2">
            <div class="flex-1 min-w-0">
              <h4 class="font-medium text-text-primary-light dark:text-text-primary-dark text-sm truncate">${item.product.name}</h4>
              <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark">Rs. ${parseFloat(item.product.price).toLocaleString()} each</p>
            </div>
            <div class="flex items-center gap-2">
              <button data-qty-minus="${item.product.id}" class="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark hover:bg-danger/10 hover:text-danger hover:border-danger transition-colors">
                <span class="material-symbols-outlined text-sm">remove</span>
              </button>
              <span class="w-8 text-center font-bold text-text-primary-light dark:text-text-primary-dark">${item.quantity}</span>
              <button data-qty-plus="${item.product.id}" class="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark hover:bg-primary/10 hover:text-primary hover:border-primary transition-colors">
                <span class="material-symbols-outlined text-sm">add</span>
              </button>
            </div>
            <p class="w-20 text-right font-bold text-text-primary-light dark:text-text-primary-dark">Rs. ${(parseFloat(item.product.price) * item.quantity).toLocaleString()}</p>
          </div>
        `).join("");
        
        // Attach handlers
        cartItems.querySelectorAll("[data-qty-minus]").forEach(btn => {
          btn.addEventListener("click", () => updateQuantity(parseInt(btn.dataset.qtyMinus), -1));
        });
        cartItems.querySelectorAll("[data-qty-plus]").forEach(btn => {
          btn.addEventListener("click", () => updateQuantity(parseInt(btn.dataset.qtyPlus), 1));
        });
        
        updateTotals();
      }
      
      function updateTotals() {
        const subtotal = cart.reduce((sum, item) => sum + (parseFloat(item.product.price) * item.quantity), 0);
        const tax = 0; // No tax for now
        const total = subtotal + tax;
        
        document.querySelector("[data-subtotal]").textContent = `Rs. ${subtotal.toLocaleString()}`;
        document.querySelector("[data-tax]").textContent = `Rs. ${tax.toLocaleString()}`;
        document.querySelector("[data-total]").textContent = `Rs. ${total.toLocaleString()}`;
        
        checkoutBtn.disabled = cart.length === 0;
      }
      
      // Payment method selection
      document.querySelectorAll(".payment-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          document.querySelectorAll(".payment-btn").forEach(b => {
            b.classList.remove("active", "border-primary", "bg-primary/10", "text-primary");
            b.classList.add("border-border-light", "dark:border-border-dark", "text-text-secondary-light", "dark:text-text-secondary-dark");
          });
          btn.classList.add("active", "border-primary", "bg-primary/10", "text-primary");
          btn.classList.remove("border-border-light", "dark:border-border-dark", "text-text-secondary-light", "dark:text-text-secondary-dark");
          selectedPayment = btn.dataset.payment;
        });
      });
      
      // Clear cart
      clearCartBtn?.addEventListener("click", () => {
        if (cart.length && confirm("Clear all items from cart?")) {
          cart = [];
          renderCart();
        }
      });
      
      // Checkout
      checkoutBtn?.addEventListener("click", async () => {
        if (!cart.length) return;
        
        checkoutBtn.disabled = true;
        checkoutBtn.innerHTML = `
          <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          Processing...
        `;
        
        try {
          // First add items to cart via API
          for (const item of cart) {
            await cartService.addItem(item.product.id, item.quantity);
          }
          
          // Then checkout
          const result = await ordersService.checkout({
            payment_method: selectedPayment,
          });
          
          // Extract order ID from response (handle different response structures)
          const orderId = result?.data?.order_id || result?.order_id || result?.data?.order?.order_id || result?.orderId || result?.id || "---";
          const total = cart.reduce((sum, item) => sum + (parseFloat(item.product.price) * item.quantity), 0);
          
          document.querySelector("[data-order-id]").textContent = orderId;
          document.querySelector("[data-order-total]").textContent = `Rs. ${total.toLocaleString()}`;
          successModal.classList.remove("hidden");
          
          // Clear cart
          cart = [];
          renderCart();
          
          // Clear API cart as well
          await cartService.clearCart().catch(() => {});
          
          // Reload products to update stock
          await loadProducts();
          
        } catch (error) {
          console.error("Checkout failed:", error);
          alert("Checkout failed: " + (error.message || "Please try again"));
        } finally {
          checkoutBtn.disabled = false;
          checkoutBtn.innerHTML = `
            <span class="material-symbols-outlined">point_of_sale</span>
            Complete Sale
          `;
        }
      });
      
      // Success modal actions
      document.querySelector("[data-new-sale]")?.addEventListener("click", () => {
        successModal.classList.add("hidden");
        // Optionally navigate to orders to see the new order
        // navigate("orders");
      });
      
      document.querySelector("[data-print-receipt]")?.addEventListener("click", () => {
        window.print();
      });
      
      // Search with debounce
      let searchTimeout;
      searchInput?.addEventListener("input", (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          loadProducts(e.target.value, categoryFilter?.value || "");
        }, 300);
      });
      
      // Category filter
      categoryFilter?.addEventListener("change", (e) => {
        loadProducts(searchInput?.value || "", e.target.value);
      });
      
      // Initial load
      await loadProducts();
      
      return () => {
        clearTimeout(searchTimeout);
      };
    },
  };
}

