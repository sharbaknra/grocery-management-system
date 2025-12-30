import { stockService } from "../../services/stockService.js";
import { productsService } from "../../services/productsService.js";
import { getState } from "../../state/appState.js";

export function registerStockLevelsPage(register) {
  register("stock", stockLevelsPage);
}

function stockLevelsPage() {
  // Check user role to conditionally show management buttons
  const userRole = getState().user?.role;
  const isPurchasing = userRole === "purchasing";
  
  return {
    html: `
      <div class="max-w-7xl mx-auto space-y-6">
        <!-- Page Header -->
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 class="text-3xl font-black tracking-tight text-text-primary-light dark:text-text-primary-dark">Stock Levels</h1>
            <p class="text-text-secondary-light dark:text-text-secondary-dark mt-1">Monitor and manage your inventory stock levels.</p>
          </div>
          ${!isPurchasing ? `
          <button data-route="product-form" class="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors shadow-sm">
            <span class="material-symbols-outlined text-lg">add</span>
            Add New Product
          </button>
          ` : ''}
        </div>
        
        <!-- Search & Filters -->
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="relative flex-grow">
            <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <span class="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark">search</span>
            </div>
            <input 
              type="text"
              data-search-input
              class="form-input w-full h-12 pl-12 pr-4 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="Search by product name..."
            />
          </div>
          <select 
            data-filter-status
            class="form-select h-12 px-4 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All Status</option>
            <option value="ok">OK</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>
        
        <!-- Stock Table -->
        <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="border-b border-border-light dark:border-border-dark">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Product Name</th>
                  <th class="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Current Qty</th>
                  <th class="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Min Level</th>
                  <th class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Status</th>
                  <th class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Last Restock</th>
                  <th class="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Action</th>
                </tr>
              </thead>
              <tbody data-stock-table class="divide-y divide-border-light dark:divide-border-dark">
                <tr>
                  <td colspan="6" class="px-6 py-12 text-center">
                    <div class="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                    <p class="text-text-secondary-light dark:text-text-secondary-dark">Loading stock data...</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Pagination -->
          <div class="flex items-center justify-center p-4 border-t border-border-light dark:border-border-dark">
            <div class="flex gap-1" data-pagination>
              <!-- Pagination will be rendered here -->
            </div>
          </div>
        </div>
        
        <!-- Update Quantity Modal -->
        <div data-update-modal class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div class="bg-surface-light dark:bg-surface-dark rounded-xl p-6 max-w-md w-full shadow-xl">
            <h3 class="text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-1">Update Quantity</h3>
            <p data-modal-product-name class="text-text-secondary-light dark:text-text-secondary-dark mb-2">Product Name</p>
            <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-6">
              Current Quantity: <span data-modal-current-quantity class="font-semibold">-</span>
            </p>
            
            <form data-update-form class="space-y-4">
              <input type="hidden" name="product_id" />
              
              <div>
                <label class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2 block">Adjustment Type</label>
                <div class="flex gap-3">
                  <label class="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border border-border-light dark:border-border-dark cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                    <input type="radio" name="adjustment_type" value="restock" checked class="form-radio text-primary focus:ring-primary" />
                    <span class="text-sm font-medium">Restock (+)</span>
                  </label>
                  <label class="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border border-border-light dark:border-border-dark cursor-pointer has-[:checked]:border-danger has-[:checked]:bg-danger/5">
                    <input type="radio" name="adjustment_type" value="reduce" class="form-radio text-danger focus:ring-danger" />
                    <span class="text-sm font-medium">Reduce (-)</span>
                  </label>
                  <label class="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border border-border-light dark:border-border-dark cursor-pointer has-[:checked]:border-success has-[:checked]:bg-success/5">
                    <input type="radio" name="adjustment_type" value="set" class="form-radio text-success focus:ring-success" />
                    <span class="text-sm font-medium">Set New Qty</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2 block" for="quantity">Quantity</label>
                <input 
                  type="number"
                  id="modal-quantity"
                  name="quantity"
                  min="1"
                  required
                  class="form-input w-full h-12 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark focus:border-primary focus:ring-2 focus:ring-primary/20 px-4"
                  placeholder="Enter quantity"
                />
              </div>
              
              <div>
                <label class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2 block" for="reason">Reason (Optional)</label>
                <input 
                  type="text"
                  id="modal-reason"
                  name="reason"
                  class="form-input w-full h-12 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark focus:border-primary focus:ring-2 focus:ring-primary/20 px-4"
                  placeholder="e.g., Weekly restock"
                />
              </div>
              
              <div data-modal-status class="hidden items-center gap-3 rounded-lg p-3 text-sm">
                <span class="material-symbols-outlined text-lg">info</span>
                <p class="font-medium"></p>
              </div>
              
              <div class="flex justify-end gap-3 pt-4">
                <button 
                  type="button"
                  data-close-modal
                  class="px-4 py-2.5 rounded-lg bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark font-medium hover:bg-border-light dark:hover:bg-border-dark transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  data-modal-submit
                  class="px-4 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors disabled:opacity-50"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `,

    async onMount() {
      const searchInput = document.querySelector("[data-search-input]");
      const filterStatus = document.querySelector("[data-filter-status]");
      const stockTable = document.querySelector("[data-stock-table]");
      const updateModal = document.querySelector("[data-update-modal]");
      const updateForm = document.querySelector("[data-update-form]");
      
      // Check user role for access restrictions
      const userRole = getState().user?.role;
      const isPurchasing = userRole === "purchasing";
      
      let debounceTimer = null;
      let allProducts = [];

      async function loadStock(filters = {}) {
        try {
          renderLoading();
          const products = await productsService.list(filters);
          allProducts = Array.isArray(products) ? products : products.products || [];
          renderStock(allProducts);
        } catch (error) {
          console.error("Failed to load stock:", error);
          renderError("Failed to load stock data. Please try again.");
        }
      }

      function renderLoading() {
        if (!stockTable) return;
        stockTable.innerHTML = `
          <tr>
            <td colspan="6" class="px-6 py-12 text-center">
              <div class="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
              <p class="text-text-secondary-light dark:text-text-secondary-dark">Loading stock data...</p>
            </td>
          </tr>
        `;
      }

      function renderError(message) {
        if (!stockTable) return;
        stockTable.innerHTML = `
          <tr>
            <td colspan="6" class="px-6 py-12 text-center">
              <span class="material-symbols-outlined text-5xl text-danger mb-4 block">error</span>
              <p class="text-text-secondary-light dark:text-text-secondary-dark">${message}</p>
            </td>
          </tr>
        `;
      }

      function renderStock(products) {
        if (!stockTable) return;

        // Filter by status if needed
        const statusFilter = filterStatus?.value;
        let filtered = products;
        
        // Get user role for access restrictions (re-check in case state changed)
        const currentUserRole = getState().user?.role;
        const currentIsPurchasing = currentUserRole === "purchasing";
        
        if (statusFilter) {
          filtered = products.filter((p) => {
            const qty = p.stock_quantity || p.quantity || 0;
            const min = p.min_stock_level || 10;
            if (statusFilter === "out") return qty <= 0;
            if (statusFilter === "low") return qty > 0 && qty < min;
            if (statusFilter === "ok") return qty >= min;
            return true;
          });
        }

        if (!filtered.length) {
          stockTable.innerHTML = `
            <tr>
              <td colspan="6" class="px-6 py-12 text-center">
                <span class="material-symbols-outlined text-5xl text-text-secondary-light dark:text-text-secondary-dark mb-4 block">inventory_2</span>
                <p class="text-lg font-medium text-text-primary-light dark:text-text-primary-dark">No products found</p>
                <p class="text-text-secondary-light dark:text-text-secondary-dark mt-1">Try adjusting your search or filters</p>
              </td>
            </tr>
          `;
          return;
        }

        stockTable.innerHTML = filtered.map((product) => {
          const qty = product.stock_quantity || product.quantity || 0;
          const min = product.min_stock_level || 10;
          const status = getStockStatus(qty, min);
          const lastRestock = product.last_restock_date 
            ? new Date(product.last_restock_date).toLocaleDateString() 
            : "-";

          return `
            <tr class="hover:bg-background-light dark:hover:bg-background-dark transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">${product.name}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span class="text-sm text-text-primary-light dark:text-text-primary-dark">${qty}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span class="text-sm text-text-secondary-light dark:text-text-secondary-dark">${min}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center gap-1.5 rounded-full ${status.class} px-2.5 py-1 text-xs font-semibold">
                  <span class="w-1.5 h-1.5 rounded-full ${status.dotClass}"></span>
                  ${status.label}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-text-secondary-light dark:text-text-secondary-dark">${lastRestock}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                ${!currentIsPurchasing ? `
                <button 
                  data-update-stock="${product.id}"
                  data-product-name="${product.name}"
                  data-current-quantity="${qty}"
                  class="text-sm font-medium text-primary hover:underline"
                >
                  Update quantity
                </button>
                ` : '<span class="text-sm text-text-secondary-light dark:text-text-secondary-dark">-</span>'}
              </td>
            </tr>
          `;
        }).join("");

        // Attach update handlers
        document.querySelectorAll("[data-update-stock]").forEach((btn) => {
          btn.addEventListener("click", () => {
            const productId = btn.dataset.updateStock;
            const productName = btn.dataset.productName;
            const currentQuantity = btn.dataset.currentQuantity || "0";
            openUpdateModal(productId, productName, currentQuantity);
          });
        });
      }

      function getStockStatus(qty, min) {
        if (qty <= 0) {
          return {
            label: "Out of Stock",
            class: "bg-danger/10 text-danger",
            dotClass: "bg-danger",
          };
        }
        if (qty < min) {
          return {
            label: "Low Stock",
            class: "bg-warning/10 text-warning",
            dotClass: "bg-warning",
          };
        }
        return {
          label: "OK",
          class: "bg-success/10 text-success",
          dotClass: "bg-success",
        };
      }

      function openUpdateModal(productId, productName, currentQuantity) {
        const nameEl = document.querySelector("[data-modal-product-name]");
        const currentQtyEl = document.querySelector("[data-modal-current-quantity]");
        const productIdInput = updateForm?.querySelector('input[name="product_id"]');
        
        if (nameEl) nameEl.textContent = productName;
        if (currentQtyEl) currentQtyEl.textContent = currentQuantity || "0";
        if (productIdInput) productIdInput.value = productId;
        
        // Reset form
        updateForm?.reset();
        if (productIdInput) productIdInput.value = productId;
        
        // Reset adjustment type to restock
        const restockRadio = updateForm?.querySelector('input[name="adjustment_type"][value="restock"]');
        if (restockRadio) restockRadio.checked = true;
        
        updateModal?.classList.remove("hidden");
        updateModal?.classList.add("flex");
      }

      function closeUpdateModal() {
        updateModal?.classList.add("hidden");
        updateModal?.classList.remove("flex");
      }

      // Close modal
      document.querySelector("[data-close-modal]")?.addEventListener("click", closeUpdateModal);
      updateModal?.addEventListener("click", (e) => {
        if (e.target === updateModal) closeUpdateModal();
      });

      // Form submission
      updateForm?.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const formData = new FormData(updateForm);
        const productId = formData.get("product_id");
        const adjustmentType = formData.get("adjustment_type");
        const quantity = parseInt(formData.get("quantity"));
        const reason = formData.get("reason");

        const submitBtn = document.querySelector("[data-modal-submit]");
        const statusEl = document.querySelector("[data-modal-status]");

        try {
          submitBtn.disabled = true;
          submitBtn.textContent = "Saving...";

          // Prepare payload with correct field names (backend expects productId, not product_id)
          const payload = {
            productId: parseInt(productId),
            quantity: quantity,
            reason: reason || undefined, // Optional field
          };

          if (adjustmentType === "restock") {
            await stockService.restock(payload);
          } else if (adjustmentType === "reduce") {
            await stockService.reduce(payload);
          } else if (adjustmentType === "set") {
            await stockService.setQuantity(payload);
          }

          closeUpdateModal();
          await loadStock();
        } catch (error) {
          console.error("Failed to update stock:", error);
          if (statusEl) {
            statusEl.classList.remove("hidden");
            statusEl.classList.add("flex", "bg-red-50", "text-red-600");
            statusEl.querySelector("p").textContent = error.message || "Failed to update stock";
          }
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = "Save";
        }
      });

      // Search with debounce
      searchInput?.addEventListener("input", (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          loadStock({ search: e.target.value });
        }, 300);
      });

      // Filter by status
      filterStatus?.addEventListener("change", () => {
        renderStock(allProducts);
      });

      // Initial load
      await loadStock();

      return () => {
        clearTimeout(debounceTimer);
      };
    },
  };
}
