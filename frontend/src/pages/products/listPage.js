import { productsService } from "../../services/productsService.js";
import { getImageUrl } from "../../services/apiClient.js";

export function registerProductsListPage(register) {
  register("products", productsListPage);
}

function productsListPage() {
  return {
    html: `
      <div class="max-w-7xl mx-auto space-y-6">
        <!-- Page Header -->
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 class="text-3xl font-black tracking-tight text-text-primary-light dark:text-text-primary-dark">Product List</h1>
            <p class="text-text-secondary-light dark:text-text-secondary-dark mt-1">Manage your product inventory</p>
          </div>
          <button data-route="product-form" class="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors shadow-sm">
            <span class="material-symbols-outlined text-lg">add</span>
            Add New Product
          </button>
        </div>
        
        <!-- Filters & Search -->
        <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-4">
          <form data-search-form class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- Search -->
            <div class="md:col-span-2">
              <div class="relative">
                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span class="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark">search</span>
                </div>
                <input 
                  type="text" 
                  name="search"
                  class="form-input w-full h-11 pl-10 pr-4 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Search by product name..."
                />
              </div>
            </div>
            
            <!-- Category Filter -->
            <div>
              <select 
                name="category"
                class="form-select w-full h-11 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
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
                <option value="frozen">Frozen Foods</option>
              </select>
            </div>
            
            <!-- Sort -->
            <div>
              <select 
                name="sort"
                class="form-select w-full h-11 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Sort By</option>
                <option value="name_asc">Name (A-Z)</option>
                <option value="name_desc">Name (Z-A)</option>
                <option value="price_asc">Price (Low to High)</option>
                <option value="price_desc">Price (High to Low)</option>
                <option value="stock_asc">Stock (Low to High)</option>
              </select>
            </div>
          </form>
        </div>
        
        <!-- Products Grid -->
        <div data-products-grid class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <!-- Loading State -->
          <div class="col-span-full flex flex-col items-center justify-center py-12">
            <div class="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
            <p class="text-text-secondary-light dark:text-text-secondary-dark">Loading products...</p>
          </div>
        </div>
        
        <!-- Pagination -->
        <div data-pagination class="flex items-center justify-center gap-2 hidden">
          <!-- Pagination will be rendered here -->
        </div>
      </div>
    `,

    async onMount({ navigate }) {
      const searchForm = document.querySelector("[data-search-form]");
      const productsGrid = document.querySelector("[data-products-grid]");
      let debounceTimer = null;

      // Load products
      async function loadProducts(params = {}) {
        try {
          renderLoading();
          const data = await productsService.list(params);
          const products = Array.isArray(data) ? data : data.products || [];
          renderProducts(products);
        } catch (error) {
          console.error("Failed to load products:", error);
          renderError("Failed to load products. Please try again.");
        }
      }

      function renderLoading() {
        if (!productsGrid) return;
        productsGrid.innerHTML = `
          <div class="col-span-full flex flex-col items-center justify-center py-12">
            <div class="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
            <p class="text-text-secondary-light dark:text-text-secondary-dark">Loading products...</p>
          </div>
        `;
      }

      function renderError(message) {
        if (!productsGrid) return;
        productsGrid.innerHTML = `
          <div class="col-span-full flex flex-col items-center justify-center py-12">
            <span class="material-symbols-outlined text-5xl text-danger mb-4">error</span>
            <p class="text-text-secondary-light dark:text-text-secondary-dark">${message}</p>
            <button data-retry class="mt-4 px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors">
              Try Again
            </button>
          </div>
        `;
        document.querySelector("[data-retry]")?.addEventListener("click", () => loadProducts());
      }

      function renderProducts(products) {
        if (!productsGrid) return;

        if (!products.length) {
          productsGrid.innerHTML = `
            <div class="col-span-full flex flex-col items-center justify-center py-12">
              <span class="material-symbols-outlined text-5xl text-text-secondary-light dark:text-text-secondary-dark mb-4">inventory_2</span>
              <p class="text-lg font-medium text-text-primary-light dark:text-text-primary-dark">No products found</p>
              <p class="text-text-secondary-light dark:text-text-secondary-dark mt-1">Try adjusting your search or filters</p>
            </div>
          `;
          return;
        }

        productsGrid.innerHTML = products.map((product) => renderProductCard(product)).join("");

        // Attach click handlers
        productsGrid.querySelectorAll("[data-view-product]").forEach((btn) => {
          btn.addEventListener("click", () => {
            const id = btn.dataset.viewProduct;
            sessionStorage.setItem("gms:activeProductId", id);
            navigate("product-detail");
          });
        });

        productsGrid.querySelectorAll("[data-edit-product]").forEach((btn) => {
          btn.addEventListener("click", () => {
            const id = btn.dataset.editProduct;
            sessionStorage.setItem("gms:activeProductId", id);
            navigate("product-form");
          });
        });

        // No add-to-cart button for manager/admin views.
      }

      function renderProductCard(product) {
        const stockStatus = getStockStatus(product.stock_quantity || product.quantity || 0);
        const imageUrl = getImageUrl(product.image_url || product.image);
        const price = parseFloat(product.price) || 0;
        const category = product.category || "Uncategorized";

        return `
          <div class="flex flex-col overflow-hidden rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow-sm hover:shadow-md transition-shadow">
            <!-- Image -->
            <div class="relative aspect-[4/3] bg-background-light dark:bg-background-dark overflow-hidden">
              <img 
                src="${imageUrl}" 
                alt="${product.name}" 
                class="w-full h-full object-cover"
                onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'"
              />
              <span class="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full ${stockStatus.class} px-2.5 py-1 text-xs font-medium">
                <span class="w-1.5 h-1.5 rounded-full ${stockStatus.dotClass}"></span>
                ${stockStatus.label}
              </span>
            </div>
            
            <!-- Content -->
            <div class="flex flex-1 flex-col p-4">
              <div class="flex items-start justify-between gap-2">
                <h3 class="text-base font-bold text-text-primary-light dark:text-text-primary-dark line-clamp-1">${product.name}</h3>
                <span class="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">${category}</span>
              </div>
              <p class="mt-1 text-sm text-text-secondary-light dark:text-text-secondary-dark line-clamp-1">${product.supplier_name || "No supplier"}</p>
              <div class="mt-auto pt-4 flex items-end justify-between">
                <p class="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">Rs. ${price.toLocaleString('en-PK')}</p>
                <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">Stock: ${product.stock_quantity || product.quantity || 0}</p>
              </div>
            </div>
            
            <!-- Actions -->
            <div class="flex gap-2 border-t border-border-light dark:border-border-dark p-3">
              <button 
                data-view-product="${product.id}"
                class="flex-1 flex items-center justify-center gap-1.5 h-10 rounded-lg bg-background-light dark:bg-background-dark text-text-secondary-light dark:text-text-secondary-dark text-sm font-medium hover:bg-border-light dark:hover:bg-border-dark transition-colors"
              >
                <span class="material-symbols-outlined text-base">visibility</span>
                View
              </button>
              <button 
                data-edit-product="${product.id}"
                class="flex-1 flex items-center justify-center gap-1.5 h-10 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors"
              >
                <span class="material-symbols-outlined text-base">edit</span>
                Edit
              </button>
            </div>
          </div>
        `;
      }

      function getStockStatus(quantity) {
        if (quantity <= 0) {
          return {
            label: "Out of Stock",
            class: "bg-danger/10 text-danger",
            dotClass: "bg-danger",
          };
        }
        if (quantity < 10) {
          return {
            label: "Low Stock",
            class: "bg-warning/10 text-warning",
            dotClass: "bg-warning",
          };
        }
        return {
          label: "In Stock",
          class: "bg-success/10 text-success",
          dotClass: "bg-success",
        };
      }

      // Search form handler with debounce
      searchForm?.addEventListener("input", (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          const formData = new FormData(searchForm);
          const params = {};
          for (const [key, value] of formData.entries()) {
            if (value) params[key] = value;
          }
          loadProducts(params);
        }, 300);
      });

      searchForm?.addEventListener("change", (e) => {
        if (e.target.tagName === "SELECT") {
          const formData = new FormData(searchForm);
          const params = {};
          for (const [key, value] of formData.entries()) {
            if (value) params[key] = value;
          }
          loadProducts(params);
        }
      });

      // Initial load
      await loadProducts();

      return () => {
        clearTimeout(debounceTimer);
      };
    },
  };
}
