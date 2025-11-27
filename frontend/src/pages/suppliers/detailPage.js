import { suppliersService } from "../../services/suppliersService.js";

export function registerSupplierDetailPage(register) {
  register("supplier-detail", supplierDetailPage);
}

function supplierDetailPage() {
  return {
    html: `
      <div class="max-w-5xl mx-auto">
        <!-- Breadcrumbs -->
        <nav class="flex items-center gap-2 mb-6 text-sm">
          <button data-route="suppliers" class="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors">Suppliers</button>
          <span class="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark text-base">chevron_right</span>
          <span data-supplier-name class="text-text-primary-light dark:text-text-primary-dark font-medium">Supplier Name</span>
        </nav>
        
        <!-- Loading State -->
        <div data-loading class="flex flex-col items-center justify-center py-20">
          <div class="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
          <p class="text-text-secondary-light dark:text-text-secondary-dark">Loading supplier details...</p>
        </div>
        
        <!-- Error State -->
        <div data-error class="hidden flex-col items-center justify-center py-20">
          <span class="material-symbols-outlined text-6xl text-danger mb-4">error</span>
          <p class="text-lg font-medium text-text-primary-light dark:text-text-primary-dark">Failed to load supplier</p>
          <p data-error-message class="text-text-secondary-light dark:text-text-secondary-dark mt-1">Please try again later.</p>
          <button data-route="suppliers" class="mt-6 px-6 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors">
            Back to Suppliers
          </button>
        </div>
        
        <!-- Supplier Content -->
        <div data-supplier-content class="hidden">
          <!-- Header -->
          <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 data-supplier-title class="text-3xl font-black tracking-tight text-text-primary-light dark:text-text-primary-dark">Supplier Name</h1>
              <p data-supplier-id class="text-text-secondary-light dark:text-text-secondary-dark mt-1">Supplier ID: #S12345</p>
            </div>
            <div class="flex gap-3">
              <button data-edit-btn class="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors">
                <span class="material-symbols-outlined text-lg">edit</span>
                Edit Supplier
              </button>
              <button data-delete-btn class="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-danger/10 text-danger font-medium hover:bg-danger/20 transition-colors">
                <span class="material-symbols-outlined text-lg">delete</span>
                Delete
              </button>
            </div>
          </div>
          
          <!-- Main Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Left Column - Contact Info -->
            <div class="lg:col-span-2 space-y-6">
              <!-- Contact Card -->
              <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6">
                <h3 class="text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-6">Contact Information</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Contact Person</p>
                    <p data-contact-person class="text-base text-text-primary-light dark:text-text-primary-dark">-</p>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Phone</p>
                    <p data-phone class="text-base text-text-primary-light dark:text-text-primary-dark">-</p>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Email</p>
                    <p data-email class="text-base text-text-primary-light dark:text-text-primary-dark">-</p>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Website</p>
                    <a data-website href="#" class="text-base text-primary hover:underline">-</a>
                  </div>
                </div>
              </div>
              
              <!-- Address Card -->
              <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6">
                <h3 class="text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-6">Address</h3>
                <div class="flex items-start gap-3">
                  <span class="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark">location_on</span>
                  <div data-address class="text-text-primary-light dark:text-text-primary-dark">
                    <p>-</p>
                  </div>
                </div>
              </div>
              
              <!-- Products Card -->
              <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
                <div class="flex items-center justify-between px-6 py-4 border-b border-border-light dark:border-border-dark">
                  <h3 class="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">Linked Products</h3>
                  <span data-product-count class="inline-flex items-center rounded-full bg-primary/10 text-primary px-3 py-1 text-sm font-medium">0 products</span>
                </div>
                <div class="overflow-x-auto">
                  <table class="w-full">
                    <thead class="bg-background-light dark:bg-background-dark">
                      <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Product</th>
                        <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Category</th>
                        <th class="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Stock</th>
                        <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Price</th>
                      </tr>
                    </thead>
                    <tbody data-products-table class="divide-y divide-border-light dark:divide-border-dark">
                      <tr>
                        <td colspan="4" class="px-6 py-8 text-center text-text-secondary-light dark:text-text-secondary-dark">
                          No products linked to this supplier.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <!-- Right Column - Stats -->
            <div class="space-y-6">
              <!-- Stats Card -->
              <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6">
                <h3 class="text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-4">Statistics</h3>
                <div class="space-y-4">
                  <div class="flex justify-between items-center">
                    <p class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Total Products</p>
                    <p data-total-products class="text-base font-bold text-text-primary-light dark:text-text-primary-dark">0</p>
                  </div>
                  <div class="flex justify-between items-center">
                    <p class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Total Orders</p>
                    <p data-total-orders class="text-base font-bold text-text-primary-light dark:text-text-primary-dark">0</p>
                  </div>
                  <div class="flex justify-between items-center">
                    <p class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Last Order</p>
                    <p data-last-order class="text-base font-medium text-text-secondary-light dark:text-text-secondary-dark">-</p>
                  </div>
                </div>
              </div>
              
              <!-- Notes Card -->
              <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6">
                <h3 class="text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-4">Notes</h3>
                <p data-notes class="text-text-secondary-light dark:text-text-secondary-dark text-sm">No notes available.</p>
              </div>
              
              <!-- Quick Actions -->
              <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6">
                <h3 class="text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-4">Quick Actions</h3>
                <div class="space-y-3">
                  <button data-route="reorder-dashboard" class="w-full flex items-center justify-center gap-2 h-10 rounded-lg bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors">
                    <span class="material-symbols-outlined text-lg">inventory</span>
                    View Reorder Dashboard
                  </button>
                  <button data-add-product class="w-full flex items-center justify-center gap-2 h-10 rounded-lg bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark font-medium hover:bg-border-light dark:hover:bg-border-dark transition-colors">
                    <span class="material-symbols-outlined text-lg">add</span>
                    Add Product
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,

    async onMount({ navigate }) {
      const supplierId = sessionStorage.getItem("gms:activeSupplierId");
      
      const loadingEl = document.querySelector("[data-loading]");
      const errorEl = document.querySelector("[data-error]");
      const contentEl = document.querySelector("[data-supplier-content]");

      if (!supplierId) {
        showError("No supplier selected");
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
        const supplier = await suppliersService.getById(supplierId);
        renderSupplier(supplier);
        showContent();
        attachEventHandlers(supplier, navigate);
      } catch (error) {
        console.error("Failed to load supplier:", error);
        showError(error.message || "Failed to load supplier details");
      }
    },
  };
}

function renderSupplier(supplier) {
  // Header
  setText("[data-supplier-name]", supplier.name);
  setText("[data-supplier-title]", supplier.name);
  setText("[data-supplier-id]", `Supplier ID: #S${supplier.id}`);

  // Contact Info
  setText("[data-contact-person]", supplier.contact_person || "-");
  setText("[data-phone]", supplier.phone || "-");
  setText("[data-email]", supplier.email || "-");
  
  const websiteEl = document.querySelector("[data-website]");
  if (websiteEl) {
    if (supplier.website) {
      websiteEl.textContent = supplier.website;
      websiteEl.href = supplier.website;
    } else {
      websiteEl.textContent = "-";
      websiteEl.removeAttribute("href");
    }
  }

  // Address
  const addressEl = document.querySelector("[data-address]");
  if (addressEl) {
    const addressParts = [
      supplier.address,
      supplier.city,
      supplier.state,
      supplier.postal_code,
      supplier.country,
    ].filter(Boolean);
    
    if (addressParts.length) {
      addressEl.innerHTML = `<p>${addressParts.slice(0, 2).join(", ")}</p><p>${addressParts.slice(2).join(", ")}</p>`;
    } else {
      addressEl.innerHTML = "<p>No address on file</p>";
    }
  }

  // Stats
  setText("[data-total-products]", supplier.product_count || 0);
  setText("[data-total-orders]", supplier.order_count || 0);
  setText("[data-last-order]", supplier.last_order_date ? formatDate(supplier.last_order_date) : "-");

  // Notes
  setText("[data-notes]", supplier.notes || "No notes available.");

  // Products
  const products = supplier.products || [];
  setText("[data-product-count]", `${products.length} products`);
  renderProducts(products);
}

function renderProducts(products) {
  const tbody = document.querySelector("[data-products-table]");
  if (!tbody) return;

  if (!products.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="px-6 py-8 text-center text-text-secondary-light dark:text-text-secondary-dark">
          No products linked to this supplier.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = products.map((product) => `
    <tr class="hover:bg-background-light dark:hover:bg-background-dark transition-colors">
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">${product.name}</span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="text-sm text-text-secondary-light dark:text-text-secondary-dark">${product.category || "-"}</span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-center">
        <span class="text-sm text-text-primary-light dark:text-text-primary-dark">${product.stock_quantity || 0}</span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-right">
        <span class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">Rs. ${parseFloat(product.price || 0).toLocaleString('en-PK')}</span>
      </td>
    </tr>
  `).join("");
}

function attachEventHandlers(supplier, navigate) {
  // Edit button
  document.querySelector("[data-edit-btn]")?.addEventListener("click", () => {
    sessionStorage.setItem("gms:activeSupplierId", supplier.id);
    navigate("supplier-form");
  });

  // Delete button
  document.querySelector("[data-delete-btn]")?.addEventListener("click", async () => {
    if (!confirm(`Are you sure you want to delete "${supplier.name}"?`)) return;
    
    try {
      await suppliersService.remove(supplier.id);
      sessionStorage.removeItem("gms:activeSupplierId");
      navigate("suppliers");
    } catch (error) {
      console.error("Failed to delete supplier:", error);
      alert("Failed to delete supplier. Please try again.");
    }
  });

  // Add product button
  document.querySelector("[data-add-product]")?.addEventListener("click", () => {
    // Pre-select this supplier when creating a new product
    sessionStorage.setItem("gms:preselectedSupplierId", supplier.id);
    navigate("product-form");
  });
}

function setText(selector, value) {
  const el = document.querySelector(selector);
  if (el) el.textContent = value;
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
