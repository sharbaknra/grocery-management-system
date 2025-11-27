import { suppliersService } from "../../services/suppliersService.js";
import { stockService } from "../../services/stockService.js";

export function registerReorderDashboardPage(register) {
  register("reorder-dashboard", reorderDashboardPage);
}

function reorderDashboardPage() {
  return {
    html: `
      <div class="max-w-7xl mx-auto space-y-6">
        <!-- Page Header -->
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 class="text-3xl font-black tracking-tight text-text-primary-light dark:text-text-primary-dark">Reorder Dashboard</h1>
            <p class="text-text-secondary-light dark:text-text-secondary-dark mt-1">Review items with low stock and add them to your next purchase order.</p>
          </div>
          <button data-review-order class="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors shadow-sm">
            <span class="material-symbols-outlined text-lg">shopping_cart</span>
            <span>Review Order (<span data-order-count>0</span> items)</span>
          </button>
        </div>
        
        <!-- Loading State -->
        <div data-loading class="flex flex-col items-center justify-center py-20">
          <div class="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
          <p class="text-text-secondary-light dark:text-text-secondary-dark">Loading reorder data...</p>
        </div>
        
        <!-- Content -->
        <div data-content class="hidden space-y-4">
          <!-- Supplier Groups will be rendered here -->
        </div>
        
        <!-- Empty State -->
        <div data-empty class="hidden flex-col items-center justify-center py-20">
          <span class="material-symbols-outlined text-6xl text-success mb-4">check_circle</span>
          <p class="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">All stocked up!</p>
          <p class="text-text-secondary-light dark:text-text-secondary-dark mt-1">No products are currently below minimum stock levels.</p>
          <button data-route="products" class="mt-6 px-6 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors">
            View Products
          </button>
        </div>
      </div>
    `,

    async onMount() {
      const loadingEl = document.querySelector("[data-loading]");
      const contentEl = document.querySelector("[data-content]");
      const emptyEl = document.querySelector("[data-empty]");
      const orderCountEl = document.querySelector("[data-order-count]");

      let reorderItems = new Set();

      function showLoading() {
        loadingEl?.classList.remove("hidden");
        loadingEl?.classList.add("flex");
        contentEl?.classList.add("hidden");
        emptyEl?.classList.add("hidden");
      }

      function showContent() {
        loadingEl?.classList.add("hidden");
        contentEl?.classList.remove("hidden");
        emptyEl?.classList.add("hidden");
      }

      function showEmpty() {
        loadingEl?.classList.add("hidden");
        contentEl?.classList.add("hidden");
        emptyEl?.classList.remove("hidden");
        emptyEl?.classList.add("flex");
      }

      function updateOrderCount() {
        if (orderCountEl) {
          orderCountEl.textContent = reorderItems.size;
        }
      }

      async function loadReorderData() {
        try {
          showLoading();
          
          // Try to get reorder dashboard data, fall back to low stock
          let data;
          try {
            data = await suppliersService.getReorderDashboard();
          } catch {
            // Fall back to low stock data
            const lowStock = await stockService.getLowStock();
            data = groupBySupplier(lowStock);
          }

          if (!data || (Array.isArray(data) && !data.length) || (data.groups && !data.groups.length)) {
            showEmpty();
            return;
          }

          renderSupplierGroups(Array.isArray(data) ? data : data.groups || []);
          showContent();
        } catch (error) {
          console.error("Failed to load reorder data:", error);
          showEmpty();
        }
      }

      function groupBySupplier(products) {
        const groups = {};
        products.forEach((product) => {
          const supplierName = product.supplier_name || "Unknown Supplier";
          if (!groups[supplierName]) {
            groups[supplierName] = {
              supplier_name: supplierName,
              supplier_id: product.supplier_id,
              products: [],
            };
          }
          groups[supplierName].products.push(product);
        });
        return Object.values(groups);
      }

      function renderSupplierGroups(groups) {
        if (!contentEl) return;

        contentEl.innerHTML = groups.map((group, index) => {
          const products = group.products || [];
          const lowStockCount = products.length;

          return `
            <details class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm group" ${index === 0 ? "open" : ""}>
              <summary class="flex cursor-pointer items-center justify-between gap-6 p-4 hover:bg-background-light dark:hover:bg-background-dark transition-colors rounded-xl">
                <div class="flex items-center gap-3">
                  <p class="text-lg font-medium text-text-primary-light dark:text-text-primary-dark">${group.supplier_name}</p>
                  <span class="flex items-center justify-center text-xs font-bold text-white bg-accent rounded-full h-6 min-w-[24px] px-2">${lowStockCount}</span>
                </div>
                <div class="flex items-center gap-4">
                  <button 
                    data-add-all-supplier="${group.supplier_id || group.supplier_name}"
                    class="text-primary text-sm font-bold hover:underline"
                    onclick="event.stopPropagation()"
                  >
                    Add All
                  </button>
                  <span class="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark group-open:rotate-180 transition-transform">expand_more</span>
                </div>
              </summary>
              <div class="px-4 pb-4">
                <div class="overflow-x-auto rounded-lg border border-border-light dark:border-border-dark">
                  <table class="w-full">
                    <thead class="bg-background-light dark:bg-background-dark">
                      <tr>
                        <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Product</th>
                        <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Current Qty</th>
                        <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Min. Level</th>
                        <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Shortage</th>
                        <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Suggested</th>
                        <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Action</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-border-light dark:divide-border-dark">
                      ${products.map((product) => {
                        const qty = product.stock_quantity || product.quantity || 0;
                        const min = product.min_stock_level || 10;
                        const shortage = Math.max(0, min - qty);
                        const suggested = Math.max(shortage, min);
                        const productId = product.id || product.product_id;
                        const isAdded = reorderItems.has(productId);

                        return `
                          <tr>
                            <td class="px-4 py-3 text-sm text-text-primary-light dark:text-text-primary-dark">${product.name || product.product_name}</td>
                            <td class="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">${qty}</td>
                            <td class="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">${min}</td>
                            <td class="px-4 py-3 text-sm font-bold text-accent">${shortage}</td>
                            <td class="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">${suggested}</td>
                            <td class="px-4 py-3">
                              ${isAdded ? `
                                <div class="flex items-center gap-1 text-success text-sm font-bold">
                                  <span class="material-symbols-outlined text-base fill">check_circle</span>
                                  Added
                                </div>
                              ` : `
                                <button 
                                  data-add-product="${productId}"
                                  class="flex items-center gap-1 text-primary text-sm font-bold hover:underline"
                                >
                                  <span class="material-symbols-outlined text-base">add_shopping_cart</span>
                                  Add
                                </button>
                              `}
                            </td>
                          </tr>
                        `;
                      }).join("")}
                    </tbody>
                  </table>
                </div>
              </div>
            </details>
          `;
        }).join("");

        // Attach event handlers
        attachHandlers(groups);
      }

      function attachHandlers(groups) {
        // Add individual product
        document.querySelectorAll("[data-add-product]").forEach((btn) => {
          btn.addEventListener("click", () => {
            const productId = btn.dataset.addProduct;
            reorderItems.add(productId);
            updateOrderCount();
            
            // Update button to "Added"
            btn.outerHTML = `
              <div class="flex items-center gap-1 text-success text-sm font-bold">
                <span class="material-symbols-outlined text-base fill">check_circle</span>
                Added
              </div>
            `;
          });
        });

        // Add all from supplier
        document.querySelectorAll("[data-add-all-supplier]").forEach((btn) => {
          btn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const supplierId = btn.dataset.addAllSupplier;
            const group = groups.find((g) => (g.supplier_id || g.supplier_name) == supplierId);
            
            if (group?.products) {
              group.products.forEach((product) => {
                const productId = product.id || product.product_id;
                reorderItems.add(productId);
              });
              updateOrderCount();
              
              // Re-render to show all as added
              renderSupplierGroups(groups);
            }
          });
        });
      }

      // Review order button
      document.querySelector("[data-review-order]")?.addEventListener("click", () => {
        if (reorderItems.size === 0) {
          alert("No items added to order yet. Click 'Add' on products you want to reorder.");
          return;
        }
        // In a real app, this would navigate to a purchase order page
        alert(`${reorderItems.size} items ready for purchase order. This feature would create a purchase order in a full implementation.`);
      });

      // Initial load
      await loadReorderData();
    },
  };
}
