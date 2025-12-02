import { stockService } from "../../services/stockService.js";
import { suppliersService } from "../../services/suppliersService.js";

export function registerPurchasingDashboard(register) {
  register("purchasing-dashboard", purchasingDashboard);
}

function purchasingDashboard() {
  return {
    html: `
      <div class="max-w-7xl mx-auto space-y-6">
        <!-- Page Header -->
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 class="text-3xl font-black tracking-tight text-text-primary-light dark:text-text-primary-dark">Purchasing Dashboard</h1>
            <p class="text-text-secondary-light dark:text-text-secondary-dark mt-1">Manage suppliers, track stock levels, and create purchase orders.</p>
          </div>
          <div class="flex gap-3">
            <button data-route="reorder-dashboard" class="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors">
              <span class="material-symbols-outlined text-lg">shopping_cart</span>
              Create Reorder
            </button>
            <button data-route="suppliers" class="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark font-medium hover:bg-background-light dark:hover:bg-background-dark transition-colors">
              <span class="material-symbols-outlined text-lg">domain</span>
              View Suppliers
            </button>
          </div>
        </div>
        
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Total Suppliers -->
          <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-5">
            <div class="flex items-center justify-between">
              <div class="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                <span class="material-symbols-outlined text-primary text-2xl">domain</span>
              </div>
            </div>
            <div class="mt-4">
              <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">Total Suppliers</p>
              <p data-kpi="totalSuppliers" class="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mt-1">0</p>
            </div>
          </div>
          
          <!-- Low Stock Items -->
          <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-5">
            <div class="flex items-center justify-between">
              <div class="flex items-center justify-center w-12 h-12 rounded-lg bg-warning/10">
                <span class="material-symbols-outlined text-warning text-2xl">inventory</span>
              </div>
              <span class="flex items-center gap-1 text-xs font-medium text-warning">
                <span class="material-symbols-outlined text-sm">warning</span>
                Needs Attention
              </span>
            </div>
            <div class="mt-4">
              <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">Low Stock Items</p>
              <p data-kpi="lowStockCount" class="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mt-1">0</p>
            </div>
          </div>
          
          <!-- Out of Stock -->
          <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-5">
            <div class="flex items-center justify-between">
              <div class="flex items-center justify-center w-12 h-12 rounded-lg bg-danger/10">
                <span class="material-symbols-outlined text-danger text-2xl">error</span>
              </div>
              <span class="flex items-center gap-1 text-xs font-medium text-danger">
                <span class="material-symbols-outlined text-sm">priority_high</span>
                Critical
              </span>
            </div>
            <div class="mt-4">
              <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">Out of Stock</p>
              <p data-kpi="outOfStock" class="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mt-1">0</p>
            </div>
          </div>
          
          <!-- Pending Orders -->
          <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-5">
            <div class="flex items-center justify-between">
              <div class="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-500/10">
                <span class="material-symbols-outlined text-blue-500 text-2xl">pending_actions</span>
              </div>
            </div>
            <div class="mt-4">
              <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">Pending Reorders</p>
              <p data-kpi="pendingOrders" class="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mt-1">0</p>
            </div>
          </div>
        </div>
        
        <!-- Main Content -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Items Needing Reorder -->
          <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
            <div class="flex items-center justify-between px-6 py-4 border-b border-border-light dark:border-border-dark">
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-warning">inventory_2</span>
                <h3 class="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">Items Needing Reorder</h3>
              </div>
              <button data-route="stock" class="text-sm font-medium text-primary hover:underline">View All Stock</button>
            </div>
            <div data-reorder-items class="divide-y divide-border-light dark:divide-border-dark max-h-96 overflow-y-auto">
              <div class="px-6 py-8 text-center text-text-secondary-light dark:text-text-secondary-dark">
                <div class="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                Loading...
              </div>
            </div>
          </div>
          
          <!-- Supplier List -->
          <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
            <div class="flex items-center justify-between px-6 py-4 border-b border-border-light dark:border-border-dark">
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-primary">domain</span>
                <h3 class="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">Suppliers</h3>
              </div>
              <button data-route="suppliers" class="text-sm font-medium text-primary hover:underline">Manage All</button>
            </div>
            <div data-suppliers-list class="divide-y divide-border-light dark:divide-border-dark max-h-96 overflow-y-auto">
              <div class="px-6 py-8 text-center text-text-secondary-light dark:text-text-secondary-dark">
                <div class="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                Loading...
              </div>
            </div>
          </div>
        </div>
        
        <!-- Quick Actions -->
        <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6">
          <h3 class="text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-4">Purchasing Actions</h3>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button data-route="reorder-dashboard" class="flex flex-col items-center gap-2 p-4 rounded-lg bg-background-light dark:bg-background-dark hover:bg-primary/10 transition-colors group">
              <span class="material-symbols-outlined text-3xl text-text-secondary-light dark:text-text-secondary-dark group-hover:text-primary">shopping_cart</span>
              <span class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">Create Reorder</span>
            </button>
            <button data-route="suppliers" class="flex flex-col items-center gap-2 p-4 rounded-lg bg-background-light dark:bg-background-dark hover:bg-primary/10 transition-colors group">
              <span class="material-symbols-outlined text-3xl text-text-secondary-light dark:text-text-secondary-dark group-hover:text-primary">domain</span>
              <span class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">View Suppliers</span>
            </button>
            <button data-route="stock" class="flex flex-col items-center gap-2 p-4 rounded-lg bg-background-light dark:bg-background-dark hover:bg-primary/10 transition-colors group">
              <span class="material-symbols-outlined text-3xl text-text-secondary-light dark:text-text-secondary-dark group-hover:text-primary">monitoring</span>
              <span class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">Stock Levels</span>
            </button>
            <button data-route="supplier-form" class="flex flex-col items-center gap-2 p-4 rounded-lg bg-background-light dark:bg-background-dark hover:bg-primary/10 transition-colors group">
              <span class="material-symbols-outlined text-3xl text-text-secondary-light dark:text-text-secondary-dark group-hover:text-primary">add_business</span>
              <span class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">Add Supplier</span>
            </button>
          </div>
        </div>
      </div>
    `,

    async onMount({ navigate }) {
      try {
        // Fetch data in parallel
        const [lowStockData, suppliersData] = await Promise.allSettled([
          stockService.getLowStock(),
          suppliersService.list(),
        ]);

        // Process low stock data
        if (lowStockData.status === "fulfilled") {
          const response = lowStockData.value || {};
          const items = Array.isArray(response) ? response : (response.data?.items || response.items || response.data || []);
          
          const lowStock = items.filter(i => (i.quantity || i.stock_quantity || 0) > 0);
          const outOfStock = items.filter(i => (i.quantity || i.stock_quantity || 0) <= 0);
          
          updateKPI("lowStockCount", lowStock.length);
          updateKPI("outOfStock", outOfStock.length);
          
          renderReorderItems(items);
        }

        // Process suppliers data
        if (suppliersData.status === "fulfilled") {
          const response = suppliersData.value || {};
          const suppliers = Array.isArray(response) ? response : (response.data || response.suppliers || []);
          
          updateKPI("totalSuppliers", suppliers.length);
          renderSuppliersList(suppliers, navigate);
        }

      } catch (error) {
        console.error("Failed to load purchasing dashboard:", error);
      }
    },
  };
}

function updateKPI(key, value) {
  const el = document.querySelector(`[data-kpi="${key}"]`);
  if (el) el.textContent = value;
}

function renderReorderItems(items) {
  const container = document.querySelector("[data-reorder-items]");
  if (!container) return;

  if (!items.length) {
    container.innerHTML = `
      <div class="px-6 py-8 text-center text-text-secondary-light dark:text-text-secondary-dark">
        <span class="material-symbols-outlined text-4xl mb-2 block text-success">check_circle</span>
        <p class="font-medium">All items are well stocked!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = items.slice(0, 10).map(item => {
    const qty = item.quantity || item.stock_quantity || 0;
    const isOutOfStock = qty <= 0;
    const statusClass = isOutOfStock ? "bg-danger/10 text-danger" : "bg-warning/10 text-warning";
    const statusText = isOutOfStock ? "Out of Stock" : "Low Stock";
    
    return `
      <div class="flex items-center justify-between px-6 py-4 hover:bg-background-light dark:hover:bg-background-dark transition-colors">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg ${isOutOfStock ? 'bg-danger/10' : 'bg-warning/10'} flex items-center justify-center">
            <span class="material-symbols-outlined ${isOutOfStock ? 'text-danger' : 'text-warning'}">inventory_2</span>
          </div>
          <div>
            <p class="font-medium text-text-primary-light dark:text-text-primary-dark">${item.name || item.product_name}</p>
            <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark">Current: ${qty} units</p>
          </div>
        </div>
        <span class="inline-flex items-center gap-1.5 rounded-full ${statusClass} px-2.5 py-1 text-xs font-medium">
          ${statusText}
        </span>
      </div>
    `;
  }).join("");
}

function renderSuppliersList(suppliers, navigate) {
  const container = document.querySelector("[data-suppliers-list]");
  if (!container) return;

  if (!suppliers.length) {
    container.innerHTML = `
      <div class="px-6 py-8 text-center text-text-secondary-light dark:text-text-secondary-dark">
        <span class="material-symbols-outlined text-4xl mb-2 block">domain</span>
        <p class="font-medium">No suppliers found</p>
        <button data-route="supplier-form" class="mt-2 text-sm text-primary hover:underline">Add your first supplier</button>
      </div>
    `;
    return;
  }

  container.innerHTML = suppliers.slice(0, 10).map(supplier => `
    <div class="flex items-center justify-between px-6 py-4 hover:bg-background-light dark:hover:bg-background-dark transition-colors cursor-pointer" data-view-supplier="${supplier.id}">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <span class="material-symbols-outlined text-primary">domain</span>
        </div>
        <div>
          <p class="font-medium text-text-primary-light dark:text-text-primary-dark">${supplier.name}</p>
          <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark">${supplier.contact_name || supplier.contact_person || supplier.email || 'No contact'}</p>
        </div>
      </div>
      <span class="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark">chevron_right</span>
    </div>
  `).join("");

  // Attach click handlers
  container.querySelectorAll("[data-view-supplier]").forEach(el => {
    el.addEventListener("click", () => {
      const id = el.dataset.viewSupplier;
      sessionStorage.setItem("gms:activeSupplierId", id);
      navigate("supplier-detail");
    });
  });
}

