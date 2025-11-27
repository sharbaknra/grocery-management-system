import { productsService } from "../../services/productsService.js";
import { cartService } from "../../services/cartService.js";

export function registerProductDetailPage(register) {
  register("product-detail", productDetailPage);
}

function productDetailPage() {
  return {
    html: `
      <div class="max-w-6xl mx-auto">
        <!-- Breadcrumbs -->
        <nav class="flex items-center gap-2 mb-6 text-sm">
          <button data-route="products" class="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors">Products</button>
          <span class="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark text-base">chevron_right</span>
          <span data-breadcrumb-category class="text-text-secondary-light dark:text-text-secondary-dark">Category</span>
          <span class="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark text-base">chevron_right</span>
          <span data-breadcrumb-name class="text-text-primary-light dark:text-text-primary-dark font-medium">Product Name</span>
        </nav>
        
        <!-- Loading State -->
        <div data-loading class="flex flex-col items-center justify-center py-20">
          <div class="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
          <p class="text-text-secondary-light dark:text-text-secondary-dark">Loading product details...</p>
        </div>
        
        <!-- Error State -->
        <div data-error class="hidden flex-col items-center justify-center py-20">
          <span class="material-symbols-outlined text-6xl text-danger mb-4">error</span>
          <p class="text-lg font-medium text-text-primary-light dark:text-text-primary-dark">Failed to load product</p>
          <p data-error-message class="text-text-secondary-light dark:text-text-secondary-dark mt-1">Please try again later.</p>
          <button data-route="products" class="mt-6 px-6 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors">
            Back to Products
          </button>
        </div>
        
        <!-- Product Content -->
        <div data-product-content class="hidden">
          <!-- Header -->
          <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 data-product-name class="text-3xl font-black tracking-tight text-text-primary-light dark:text-text-primary-dark">Product Name</h1>
              <p data-product-id class="text-text-secondary-light dark:text-text-secondary-dark mt-1">Product ID: #P12345</p>
            </div>
            <div class="flex gap-3">
              <button data-edit-btn class="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors">
                <span class="material-symbols-outlined text-lg">edit</span>
                Edit Product
              </button>
              <button data-delete-btn class="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-danger/10 text-danger font-medium hover:bg-danger/20 transition-colors">
                <span class="material-symbols-outlined text-lg">delete</span>
                Delete
              </button>
            </div>
          </div>
          
          <!-- Main Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Left Column - Product Details -->
            <div class="lg:col-span-2 space-y-6">
              <!-- Image & Info Card -->
              <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
                <div data-product-image class="w-full aspect-video bg-background-light dark:bg-background-dark bg-center bg-cover bg-no-repeat"></div>
                <div class="p-6 space-y-6">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <p class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Category</p>
                      <p data-product-category class="text-base text-text-primary-light dark:text-text-primary-dark">-</p>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Price</p>
                      <p data-product-price class="text-base text-text-primary-light dark:text-text-primary-dark font-bold">Rs. 0</p>
                    </div>
                    <div class="sm:col-span-2">
                      <p class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Description</p>
                      <p data-product-description class="text-base text-text-secondary-light dark:text-text-secondary-dark">No description available.</p>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Barcode</p>
                      <div class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-2xl text-text-primary-light dark:text-text-primary-dark">barcode</span>
                        <p data-product-barcode class="font-mono text-base text-text-primary-light dark:text-text-primary-dark">-</p>
                      </div>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Expiry Date</p>
                      <p data-product-expiry class="text-base text-text-primary-light dark:text-text-primary-dark">-</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Right Column - Stock & Supplier -->
            <div class="space-y-6">
              <!-- Stock Card -->
              <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6">
                <h3 class="text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-4">Stock Details</h3>
                <div class="space-y-4">
                  <div class="flex justify-between items-center">
                    <p class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Current Quantity</p>
                    <p data-stock-quantity class="text-base font-bold text-text-primary-light dark:text-text-primary-dark">0</p>
                  </div>
                  <div class="flex justify-between items-center">
                    <p class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Minimum Stock</p>
                    <p data-stock-min class="text-base font-medium text-text-secondary-light dark:text-text-secondary-dark">10</p>
                  </div>
                  <div class="flex justify-between items-center">
                    <p class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Status</p>
                    <span data-stock-status class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium">
                      <span class="w-1.5 h-1.5 rounded-full"></span>
                      In Stock
                    </span>
                  </div>
                  <div class="flex justify-between items-center">
                    <p class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Last Restock</p>
                    <p data-stock-last-restock class="text-base font-medium text-text-secondary-light dark:text-text-secondary-dark">-</p>
                  </div>
                  <button data-route="stock" class="w-full mt-4 flex items-center justify-center gap-2 h-10 rounded-lg bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors">
                    <span class="material-symbols-outlined text-lg">sync</span>
                    Update Stock
                  </button>
                </div>
              </div>
              
              <!-- Supplier Card -->
              <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6">
                <h3 class="text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-4">Supplier Details</h3>
                <div class="space-y-4">
                  <div>
                    <p class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Supplier Name</p>
                    <p data-supplier-name class="text-base text-text-primary-light dark:text-text-primary-dark">-</p>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Contact Person</p>
                    <p data-supplier-contact class="text-base text-text-primary-light dark:text-text-primary-dark">-</p>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Phone</p>
                    <p data-supplier-phone class="text-base text-text-primary-light dark:text-text-primary-dark">-</p>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Email</p>
                    <p data-supplier-email class="text-base text-text-primary-light dark:text-text-primary-dark">-</p>
                  </div>
                  <button data-view-supplier class="w-full mt-4 flex items-center justify-center gap-2 h-10 rounded-lg bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark font-medium hover:bg-border-light dark:hover:bg-border-dark transition-colors">
                    View Supplier
                  </button>
                </div>
              </div>
              
              <!-- Add to Cart -->
              <button data-add-to-cart class="w-full flex items-center justify-center gap-2 h-12 rounded-lg bg-success text-white font-bold hover:bg-success/90 transition-colors">
                <span class="material-symbols-outlined">add_shopping_cart</span>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    `,

    async onMount({ navigate }) {
      const productId = sessionStorage.getItem("gms:activeProductId");
      
      const loadingEl = document.querySelector("[data-loading]");
      const errorEl = document.querySelector("[data-error]");
      const contentEl = document.querySelector("[data-product-content]");

      if (!productId) {
        showError("No product selected");
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
        const product = await productsService.getById(productId);
        renderProduct(product);
        showContent();
        attachEventHandlers(product, navigate);
      } catch (error) {
        console.error("Failed to load product:", error);
        showError(error.message || "Failed to load product details");
      }
    },
  };
}

function renderProduct(product) {
  // Breadcrumbs
  setText("[data-breadcrumb-category]", product.category || "Uncategorized");
  setText("[data-breadcrumb-name]", product.name);

  // Header
  setText("[data-product-name]", product.name);
  setText("[data-product-id]", `Product ID: #P${product.id}`);

  // Image
  const imageEl = document.querySelector("[data-product-image]");
  if (imageEl) {
    const imageUrl = product.image_url || product.image || "https://via.placeholder.com/800x400?text=No+Image";
    imageEl.style.backgroundImage = `url('${imageUrl}')`;
  }

  // Details
  setText("[data-product-category]", product.category || "Uncategorized");
  setText("[data-product-price]", `Rs. ${parseFloat(product.price || 0).toLocaleString('en-PK')}`);
  setText("[data-product-description]", product.description || "No description available.");
  setText("[data-product-barcode]", product.barcode || product.sku || "-");
  setText("[data-product-expiry]", product.expiry_date ? formatDate(product.expiry_date) : "-");

  // Stock
  const quantity = product.stock_quantity || product.quantity || 0;
  setText("[data-stock-quantity]", quantity);
  setText("[data-stock-min]", product.min_stock_level || 10);
  setText("[data-stock-last-restock]", product.last_restock_date ? formatDate(product.last_restock_date) : "-");

  // Stock status
  const statusEl = document.querySelector("[data-stock-status]");
  if (statusEl) {
    const status = getStockStatus(quantity, product.min_stock_level || 10);
    statusEl.className = `inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.class}`;
    statusEl.innerHTML = `<span class="w-1.5 h-1.5 rounded-full ${status.dotClass}"></span>${status.label}`;
  }

  // Supplier
  setText("[data-supplier-name]", product.supplier_name || "-");
  setText("[data-supplier-contact]", product.supplier_contact || "-");
  setText("[data-supplier-phone]", product.supplier_phone || "-");
  setText("[data-supplier-email]", product.supplier_email || "-");
}

function attachEventHandlers(product, navigate) {
  // Edit button
  document.querySelector("[data-edit-btn]")?.addEventListener("click", () => {
    sessionStorage.setItem("gms:activeProductId", product.id);
    navigate("product-form");
  });

  // Delete button
  document.querySelector("[data-delete-btn]")?.addEventListener("click", async () => {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) return;
    
    try {
      await productsService.remove(product.id);
      sessionStorage.removeItem("gms:activeProductId");
      navigate("products");
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Failed to delete product. Please try again.");
    }
  });

  // View supplier
  document.querySelector("[data-view-supplier]")?.addEventListener("click", () => {
    if (product.supplier_id) {
      sessionStorage.setItem("gms:activeSupplierId", product.supplier_id);
      navigate("supplier-detail");
    }
  });

  // Add to cart
  document.querySelector("[data-add-to-cart]")?.addEventListener("click", async () => {
    const btn = document.querySelector("[data-add-to-cart]");
    try {
      btn.disabled = true;
      btn.innerHTML = '<span class="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Adding...';
      await cartService.addItem({ product_id: product.id, quantity: 1 });
      btn.innerHTML = '<span class="material-symbols-outlined">check</span> Added to Cart';
      setTimeout(() => {
        btn.innerHTML = '<span class="material-symbols-outlined">add_shopping_cart</span> Add to Cart';
        btn.disabled = false;
      }, 2000);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      btn.innerHTML = '<span class="material-symbols-outlined">error</span> Failed';
      setTimeout(() => {
        btn.innerHTML = '<span class="material-symbols-outlined">add_shopping_cart</span> Add to Cart';
        btn.disabled = false;
      }, 2000);
    }
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
    month: "long",
    day: "numeric",
  });
}

function getStockStatus(quantity, minLevel) {
  if (quantity <= 0) {
    return {
      label: "Out of Stock",
      class: "bg-danger/10 text-danger",
      dotClass: "bg-danger",
    };
  }
  if (quantity < minLevel) {
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
