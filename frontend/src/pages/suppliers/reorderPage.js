import { suppliersService } from "../../services/suppliersService.js";
import { stockService } from "../../services/stockService.js";
import { reportsService } from "../../services/reportsService.js";

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
        
        <!-- Fallback Banner -->
        <div data-fallback-banner class="hidden flex items-start gap-3 px-4 py-3 rounded-lg border border-warning/30 bg-warning/10 text-warning text-sm">
          <span class="material-symbols-outlined text-base">info</span>
          <div>
            Showing low-stock items grouped by supplier because no supplier-linked shortages were found.
          </div>
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

        <!-- Quantity Input Modal -->
        <div data-quantity-modal class="hidden fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
            <div class="flex items-center justify-between p-6 border-b border-border-light dark:border-border-dark">
              <h2 class="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">Enter Restock Quantities</h2>
              <button data-close-modal class="text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
            <div class="flex-1 overflow-y-auto p-6">
              <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-4">Enter the quantity to restock for each product:</p>
              <div data-quantity-inputs class="space-y-4">
                <!-- Quantity inputs will be inserted here -->
              </div>
            </div>
            <div class="flex items-center justify-end gap-3 p-6 border-t border-border-light dark:border-border-dark">
              <button data-cancel-modal class="px-4 py-2 rounded-lg text-text-secondary-light dark:text-text-secondary-dark hover:bg-background-light dark:hover:bg-background-dark transition-colors">
                Cancel
              </button>
              <button data-submit-order class="px-6 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors">
                Create Purchase Order
              </button>
            </div>
          </div>
        </div>
      </div>
    `,

    async onMount() {
      const loadingEl = document.querySelector("[data-loading]");
      const contentEl = document.querySelector("[data-content]");
      const emptyEl = document.querySelector("[data-empty]");
      const orderCountEl = document.querySelector("[data-order-count]");
      const fallbackBanner = document.querySelector("[data-fallback-banner]");

      let reorderItems = new Set(); // Store product IDs
      let reorderItemsData = new Map(); // Store product details: { productId: { productId, quantity, productName } }

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
          fallbackBanner?.classList.add("hidden");
          reorderItems = new Set();
          reorderItemsData = new Map();
          updateOrderCount();

          const dashboardGroups = await fetchDashboardGroups();
          if (dashboardGroups.length) {
            renderSupplierGroups(dashboardGroups);
            showContent();
            return;
          }

          const fallbackGroups = await fetchFallbackLowStockGroups();
          if (fallbackGroups.length) {
            fallbackBanner?.classList.remove("hidden");
            renderSupplierGroups(fallbackGroups);
            showContent();
            return;
          }

          showEmpty();
        } catch (error) {
          console.error("Failed to load reorder data:", error);
          showEmpty();
        }
      }

      async function fetchDashboardGroups() {
        try {
          const response = await suppliersService.getReorderDashboard();
          return normalizeDashboardGroups(response);
        } catch (error) {
          console.warn("Reorder dashboard request failed, will attempt fallback.", error);
          return [];
        }
      }

      async function fetchFallbackLowStockGroups() {
        try {
          // Fetch both low stock and out of stock items
          const [lowStockResponse, outOfStockResponse] = await Promise.allSettled([
            stockService.getLowStock(),
            reportsService.getOutOfStock(),
          ]);
          
          let items = [];
          
          if (lowStockResponse.status === "fulfilled") {
            const response = lowStockResponse.value || {};
            const lowStockItems = Array.isArray(response) ? response : (response.data?.items || response.items || response.data || []);
            items = [...items, ...lowStockItems];
          }
          
          if (outOfStockResponse.status === "fulfilled") {
            const response = outOfStockResponse.value || {};
            const outOfStockItems = Array.isArray(response) ? response : (response.data?.items || response.items || response.data || []);
            items = [...items, ...outOfStockItems];
          }
          
          if (!items.length) return [];
          return groupBySupplier(items);
        } catch (error) {
          console.warn("Low stock fallback request failed.", error);
          return [];
        }
      }

      function normalizeDashboardGroups(payload) {
        if (!payload) return [];
        if (Array.isArray(payload)) return payload;
        if (Array.isArray(payload.data)) return payload.data;
        if (Array.isArray(payload.groups)) return payload.groups;
        if (Array.isArray(payload.data?.groups)) return payload.data.groups;
        return [];
      }

      function normalizeLowStockItems(payload) {
        if (!payload) return [];
        if (Array.isArray(payload)) return payload;
        if (Array.isArray(payload.items)) return payload.items;
        if (Array.isArray(payload.data?.items)) return payload.data.items;
        return [];
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

      // Store groups globally so we can access them in handlers
      let currentGroups = [];

      function renderSupplierGroups(groups) {
        if (!contentEl) return;
        currentGroups = groups; // Store for later use

        contentEl.innerHTML = groups.map((group, index) => {
          // Support both backend dashboard shape (items[]) and fallback shape (products[])
          const products = group.products || group.items || [];
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
                        // Use suggested_order_quantity from backend if available, otherwise calculate
                        const suggested = product.suggested_order_quantity || Math.max(shortage, min);
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
            const productId = parseInt(btn.dataset.addProduct);
            
            // Find product details from current groups
            let productData = null;
            for (const group of groups) {
              const products = group.products || group.items || [];
              const product = products.find(p => (p.id || p.product_id) == productId);
              if (product) {
                const qty = product.stock_quantity || product.quantity || 0;
                const min = product.min_stock_level || 10;
                const shortage = Math.max(0, min - qty);
                const suggested = product.suggested_order_quantity || Math.max(shortage, min);
                productData = {
                  productId: productId,
                  quantity: suggested,
                  productName: product.name || product.product_name,
                };
                break;
              }
            }
            
            if (productData) {
              reorderItems.add(productId);
              reorderItemsData.set(productId, productData);
              updateOrderCount();
              
              // Update button to "Added"
              btn.outerHTML = `
                <div class="flex items-center gap-1 text-success text-sm font-bold">
                  <span class="material-symbols-outlined text-base fill">check_circle</span>
                  Added
                </div>
              `;
            }
          });
        });

        // Add all from supplier
        document.querySelectorAll("[data-add-all-supplier]").forEach((btn) => {
          btn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();

            const supplierId = btn.dataset.addAllSupplier;
            const group = groups.find((g) => (g.supplier_id || g.supplier_name) == supplierId);
            if (group) {
              const products = group.products || group.items || [];
              products.forEach((product) => {
                const productId = product.id || product.product_id;
                const qty = product.stock_quantity || product.quantity || 0;
                const min = product.min_stock_level || 10;
                const shortage = Math.max(0, min - qty);
                const suggested = product.suggested_order_quantity || Math.max(shortage, min);
                
                reorderItems.add(productId);
                reorderItemsData.set(productId, {
                  productId: productId,
                  quantity: suggested,
                  productName: product.name || product.product_name,
                });
              });
              updateOrderCount();
              
              // Re-render to show all as added
              renderSupplierGroups(groups);
            }
          });
        });
      }

      // Modal functions
      function showQuantityModal() {
        const modal = document.querySelector("[data-quantity-modal]");
        const inputsContainer = document.querySelector("[data-quantity-inputs]");
        
        if (!modal || !inputsContainer) return;

        // Clear previous inputs
        inputsContainer.innerHTML = "";

        // Create input fields for each product
        Array.from(reorderItemsData.values()).forEach((item) => {
          const inputHtml = `
            <div class="flex items-center justify-between gap-4 p-4 bg-background-light dark:bg-background-dark rounded-lg border border-border-light dark:border-border-dark">
              <div class="flex-1">
                <p class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">${item.productName}</p>
                <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">Suggested: ${item.quantity}</p>
              </div>
              <div class="flex items-center gap-2">
                <label class="text-sm text-text-secondary-light dark:text-text-secondary-dark">Qty:</label>
                <input 
                  type="number" 
                  min="1" 
                  value="${item.quantity}"
                  data-product-quantity="${item.productId}"
                  class="w-24 px-3 py-2 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>
          `;
          inputsContainer.insertAdjacentHTML("beforeend", inputHtml);
        });

        modal.classList.remove("hidden");
      }

      function hideQuantityModal() {
        const modal = document.querySelector("[data-quantity-modal]");
        if (modal) {
          modal.classList.add("hidden");
        }
      }

      // Modal event handlers
      document.querySelector("[data-close-modal]")?.addEventListener("click", hideQuantityModal);
      document.querySelector("[data-cancel-modal]")?.addEventListener("click", hideQuantityModal);

      // Close modal on backdrop click
      document.querySelector("[data-quantity-modal]")?.addEventListener("click", (e) => {
        if (e.target === e.currentTarget) {
          hideQuantityModal();
        }
      });

      // Submit order from modal
      document.querySelector("[data-submit-order]")?.addEventListener("click", async () => {
        const quantityInputs = document.querySelectorAll("[data-product-quantity]");
        const items = [];

        // Validate and collect quantities
        let isValid = true;
        quantityInputs.forEach((input) => {
          const productId = parseInt(input.dataset.productQuantity);
          const quantity = parseInt(input.value);

          if (!quantity || quantity < 1) {
            isValid = false;
            input.classList.add("ring-2", "ring-danger");
            setTimeout(() => input.classList.remove("ring-2", "ring-danger"), 2000);
          } else {
            items.push({
              productId: productId,
              quantity: quantity,
            });
          }
        });

        if (!isValid) {
          alert("Please enter valid quantities (minimum 1) for all products.");
          return;
        }

        // Hide modal
        hideQuantityModal();

        // Show loading state
        const reviewBtn = document.querySelector("[data-review-order]");
        if (reviewBtn) {
          reviewBtn.disabled = true;
          reviewBtn.innerHTML = `
            <span class="material-symbols-outlined text-lg animate-spin">sync</span>
            <span>Processing...</span>
          `;
        }

        try {
          // Call bulk restock API
          console.log("Calling bulk restock with items:", items);
          const response = await stockService.bulkRestock({ items });
          console.log("Bulk restock response:", response);
          
          if (response && response.success) {
            const { successful, failed } = response.data || {};
            
            // Show success message
            let message = `Purchase order completed! Successfully restocked ${successful?.length || 0} product(s).`;
            if (failed && failed.length > 0) {
              message += `\n\n${failed.length} product(s) failed to restock:\n${failed.map(f => `- Product ${f.productId}: ${f.error}`).join('\n')}`;
            }
            alert(message);

            // Clear reorder items
            reorderItems = new Set();
            reorderItemsData = new Map();
            updateOrderCount();

            // Reload data to reflect updated stock levels
            await loadReorderData();
          } else {
            const errorMsg = response?.message || response?.details?.message || 'Unknown error';
            console.error("Bulk restock failed:", response);
            alert(`Failed to create purchase order: ${errorMsg}`);
          }
        } catch (error) {
          console.error("Error creating purchase order:", error);
          const errorMsg = error.message || error.statusText || 'Unknown error';
          const status = error.status ? ` (Status: ${error.status})` : '';
          alert(`Failed to create purchase order: ${errorMsg}${status}\n\nPlease ensure the server is running and has been restarted to include the new endpoint.`);
        } finally {
          // Restore button
          if (reviewBtn) {
            reviewBtn.disabled = false;
            reviewBtn.innerHTML = `
              <span class="material-symbols-outlined text-lg">shopping_cart</span>
              <span>Review Order (<span data-order-count>${reorderItems.size}</span> items)</span>
            `;
          }
        }
      });

      // Review order button
      document.querySelector("[data-review-order]")?.addEventListener("click", () => {
        if (reorderItems.size === 0) {
          alert("No items added to order yet. Click 'Add' on products you want to reorder.");
          return;
        }

        // Show quantity input modal
        showQuantityModal();
      });

      // Initial load
      await loadReorderData();
    },
  };
}
