import { suppliersService } from "../../services/suppliersService.js";
import { getState } from "../../state/appState.js";

export function registerSuppliersListPage(register) {
  register("suppliers", suppliersListPage);
}

function suppliersListPage() {
  // Check user role to conditionally show supplier creation button
  const userRole = getState().user?.role;
  const isPurchasing = userRole === "purchasing";
  const isStaff = userRole === "staff";
  // Only admin and manager can create suppliers
  const canCreateSupplier = userRole === "admin" || userRole === "manager";
  
  return {
    html: `
      <div class="max-w-7xl mx-auto space-y-6">
        <!-- Page Header -->
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 class="text-3xl font-black tracking-tight text-text-primary-light dark:text-text-primary-dark">Suppliers</h1>
            <p class="text-text-secondary-light dark:text-text-secondary-dark mt-1">Manage your supplier information efficiently.</p>
          </div>
          ${canCreateSupplier ? `
          <button data-add-supplier class="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors shadow-sm">
            <span class="material-symbols-outlined text-lg fill">add</span>
            Add Supplier
          </button>
          ` : ''}
        </div>
        
        <!-- Search & Filters -->
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="w-full md:w-auto md:flex-1 md:max-w-md">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <span class="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark">search</span>
              </div>
              <input 
                type="text"
                data-search-input
                class="form-input w-full h-12 pl-12 pr-4 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Search suppliers..."
              />
            </div>
          </div>
          <button data-route="reorder-dashboard" class="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent/10 text-accent font-medium hover:bg-accent/20 transition-colors">
            <span class="material-symbols-outlined text-lg">inventory</span>
            Reorder Dashboard
          </button>
        </div>
        
        <!-- Suppliers Table -->
        <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="border-b border-border-light dark:border-border-dark">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Supplier Name</th>
                  <th class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Contact Person</th>
                  <th class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Phone</th>
                  <th class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Email</th>
                  <th class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Products</th>
                  <th class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Actions</th>
                </tr>
              </thead>
              <tbody data-suppliers-table class="divide-y divide-border-light dark:divide-border-dark">
                <tr>
                  <td colspan="6" class="px-6 py-12 text-center">
                    <div class="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                    <p class="text-text-secondary-light dark:text-text-secondary-dark">Loading suppliers...</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Pagination -->
          <div data-pagination class="flex items-center justify-between border-t border-border-light dark:border-border-dark px-6 py-4">
            <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              Showing <span data-showing-start>0</span> to <span data-showing-end>0</span> of <span data-total-count>0</span> results
            </p>
            <div class="flex gap-1">
              <button data-prev-page class="flex items-center justify-center w-10 h-10 rounded-lg border border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark transition-colors disabled:opacity-50">
                <span class="material-symbols-outlined">chevron_left</span>
              </button>
              <button data-next-page class="flex items-center justify-center w-10 h-10 rounded-lg border border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark transition-colors disabled:opacity-50">
                <span class="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `,

    async onMount({ navigate }) {
      const searchInput = document.querySelector("[data-search-input]");
      const suppliersTable = document.querySelector("[data-suppliers-table]");
      let debounceTimer = null;
      let allSuppliers = [];

      async function loadSuppliers(searchTerm = "") {
        try {
          renderLoading();
          const response = await suppliersService.list({ search: searchTerm });
          // Handle different response formats: { data: [...] }, { suppliers: [...] }, or [...]
          allSuppliers = Array.isArray(response) ? response : (response.data || response.suppliers || []);
          renderSuppliers(allSuppliers);
        } catch (error) {
          console.error("Failed to load suppliers:", error);
          renderError("Failed to load suppliers. Please try again.");
        }
      }

      function renderLoading() {
        if (!suppliersTable) return;
        suppliersTable.innerHTML = `
          <tr>
            <td colspan="6" class="px-6 py-12 text-center">
              <div class="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
              <p class="text-text-secondary-light dark:text-text-secondary-dark">Loading suppliers...</p>
            </td>
          </tr>
        `;
      }

      function renderError(message) {
        if (!suppliersTable) return;
        suppliersTable.innerHTML = `
          <tr>
            <td colspan="6" class="px-6 py-12 text-center">
              <span class="material-symbols-outlined text-5xl text-danger mb-4 block">error</span>
              <p class="text-text-secondary-light dark:text-text-secondary-dark">${message}</p>
            </td>
          </tr>
        `;
      }

      function renderSuppliers(suppliers) {
        if (!suppliersTable) return;

        // Update pagination info
        setText("[data-showing-start]", suppliers.length ? "1" : "0");
        setText("[data-showing-end]", suppliers.length.toString());
        setText("[data-total-count]", suppliers.length.toString());

        if (!suppliers.length) {
          suppliersTable.innerHTML = `
            <tr>
              <td colspan="6" class="px-6 py-12 text-center">
                <span class="material-symbols-outlined text-5xl text-text-secondary-light dark:text-text-secondary-dark mb-4 block">domain</span>
                <p class="text-lg font-medium text-text-primary-light dark:text-text-primary-dark">No suppliers found</p>
                <p class="text-text-secondary-light dark:text-text-secondary-dark mt-1">Add your first supplier to get started</p>
              </td>
            </tr>
          `;
          return;
        }

        suppliersTable.innerHTML = suppliers.map((supplier) => `
          <tr class="hover:bg-background-light dark:hover:bg-background-dark transition-colors">
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">${supplier.name}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="text-sm text-text-secondary-light dark:text-text-secondary-dark">${supplier.contact_name || supplier.contact_person || "-"}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="text-sm text-text-secondary-light dark:text-text-secondary-dark">${supplier.phone || "-"}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="text-sm text-text-secondary-light dark:text-text-secondary-dark">${supplier.email || "-"}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="inline-flex items-center rounded-full bg-background-light dark:bg-background-dark px-3 py-1 text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                ${supplier.product_count || 0}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center gap-3">
                <button 
                  data-view-supplier="${supplier.id}"
                  class="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors"
                  title="View Details"
                >
                  <span class="material-symbols-outlined">visibility</span>
                </button>
                <button 
                  data-edit-supplier="${supplier.id}"
                  class="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors"
                  title="Edit"
                >
                  <span class="material-symbols-outlined">edit</span>
                </button>
                <button 
                  data-delete-supplier="${supplier.id}"
                  class="text-text-secondary-light dark:text-text-secondary-dark hover:text-danger transition-colors"
                  title="Delete"
                >
                  <span class="material-symbols-outlined">delete</span>
                </button>
              </div>
            </td>
          </tr>
        `).join("");

        // Attach event handlers
        attachRowHandlers(navigate);
      }

      function attachRowHandlers(navigate) {
        // View supplier
        document.querySelectorAll("[data-view-supplier]").forEach((btn) => {
          btn.addEventListener("click", () => {
            const id = btn.dataset.viewSupplier;
            sessionStorage.setItem("gms:activeSupplierId", id);
            navigate("supplier-detail");
          });
        });

        // Edit supplier
        document.querySelectorAll("[data-edit-supplier]").forEach((btn) => {
          btn.addEventListener("click", () => {
            const id = btn.dataset.editSupplier;
            sessionStorage.setItem("gms:activeSupplierId", id);
            navigate("supplier-form");
          });
        });

        // Delete supplier
        document.querySelectorAll("[data-delete-supplier]").forEach((btn) => {
          btn.addEventListener("click", async () => {
            const id = btn.dataset.deleteSupplier;
            const supplier = allSuppliers.find((s) => s.id == id);
            if (!confirm(`Are you sure you want to delete "${supplier?.name || "this supplier"}"?`)) return;
            
            try {
              await suppliersService.remove(id);
              await loadSuppliers();
            } catch (error) {
              console.error("Failed to delete supplier:", error);
              alert("Failed to delete supplier. Please try again.");
            }
          });
        });
      }

      // Search with debounce
      searchInput?.addEventListener("input", (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          loadSuppliers(e.target.value);
        }, 300);
      });

      // Add supplier button
      document.querySelector("[data-add-supplier]")?.addEventListener("click", () => {
        sessionStorage.removeItem("gms:activeSupplierId");
        navigate("supplier-form");
      });

      // Initial load
      await loadSuppliers();

      return () => {
        clearTimeout(debounceTimer);
      };
    },
  };
}

function setText(selector, value) {
  const el = document.querySelector(selector);
  if (el) el.textContent = value;
}
