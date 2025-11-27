import { suppliersService } from "../../services/suppliersService.js";

export function registerSupplierFormPage(register) {
  register("supplier-form", supplierFormPage);
}

function supplierFormPage() {
  return {
    html: `
      <div class="max-w-3xl mx-auto">
        <!-- Page Header -->
        <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 data-page-heading class="text-3xl font-black tracking-tight text-text-primary-light dark:text-text-primary-dark">Add New Supplier</h1>
            <p class="text-text-secondary-light dark:text-text-secondary-dark mt-1">Fill in the details below to add a new supplier.</p>
          </div>
          <button data-route="suppliers" class="flex items-center gap-2 px-4 py-2 rounded-lg text-text-secondary-light dark:text-text-secondary-dark hover:bg-background-light dark:hover:bg-background-dark transition-colors">
            <span class="material-symbols-outlined">arrow_back</span>
            Back to Suppliers
          </button>
        </div>
        
        <!-- Form -->
        <form data-supplier-form class="space-y-6">
          <!-- Basic Information -->
          <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6">
            <h2 class="text-xl font-bold tracking-tight text-text-primary-light dark:text-text-primary-dark pb-4 border-b border-border-light dark:border-border-dark mb-6">Basic Information</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="flex flex-col md:col-span-2">
                <label class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2" for="name">
                  Supplier Name <span class="text-danger">*</span>
                </label>
                <input 
                  type="text"
                  id="name"
                  name="name"
                  required
                  class="form-input h-12 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark focus:border-primary focus:ring-2 focus:ring-primary/20 px-4"
                  placeholder="e.g., Global Foods Inc."
                />
              </div>
              
              <div class="flex flex-col">
                <label class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2" for="contact_person">
                  Contact Person <span class="text-danger">*</span>
                </label>
                <input 
                  type="text"
                  id="contact_person"
                  name="contact_person"
                  required
                  class="form-input h-12 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark focus:border-primary focus:ring-2 focus:ring-primary/20 px-4"
                  placeholder="e.g., John Smith"
                />
              </div>
              
              <div class="flex flex-col">
                <label class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2" for="phone">
                  Phone Number <span class="text-danger">*</span>
                </label>
                <input 
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  class="form-input h-12 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark focus:border-primary focus:ring-2 focus:ring-primary/20 px-4"
                  placeholder="e.g., 0300-1234567"
                />
              </div>
              
              <div class="flex flex-col">
                <label class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2" for="email">
                  Email Address <span class="text-danger">*</span>
                </label>
                <input 
                  type="email"
                  id="email"
                  name="email"
                  required
                  class="form-input h-12 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark focus:border-primary focus:ring-2 focus:ring-primary/20 px-4"
                  placeholder="e.g., contact@supplier.com"
                />
              </div>
            </div>
          </div>
          
          <!-- Address Information -->
          <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6">
            <h2 class="text-xl font-bold tracking-tight text-text-primary-light dark:text-text-primary-dark pb-4 border-b border-border-light dark:border-border-dark mb-6">Address Information</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="flex flex-col md:col-span-2">
                <label class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2" for="address">Street Address</label>
                <input 
                  type="text"
                  id="address"
                  name="address"
                  class="form-input h-12 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark focus:border-primary focus:ring-2 focus:ring-primary/20 px-4"
                  placeholder="e.g., Shop 5, Main Bazaar"
                />
              </div>
              
              <div class="flex flex-col">
                <label class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2" for="city">City</label>
                <input 
                  type="text"
                  id="city"
                  name="city"
                  class="form-input h-12 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark focus:border-primary focus:ring-2 focus:ring-primary/20 px-4"
                  placeholder="e.g., Lahore"
                />
              </div>
              
              <div class="flex flex-col">
                <label class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2" for="state">State/Province</label>
                <input 
                  type="text"
                  id="state"
                  name="state"
                  class="form-input h-12 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark focus:border-primary focus:ring-2 focus:ring-primary/20 px-4"
                  placeholder="e.g., Punjab"
                />
              </div>
              
              <div class="flex flex-col">
                <label class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2" for="postal_code">Postal Code</label>
                <input 
                  type="text"
                  id="postal_code"
                  name="postal_code"
                  class="form-input h-12 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark focus:border-primary focus:ring-2 focus:ring-primary/20 px-4"
                  placeholder="e.g., 54000"
                />
              </div>
              
              <div class="flex flex-col">
                <label class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2" for="country">Country</label>
                <input 
                  type="text"
                  id="country"
                  name="country"
                  class="form-input h-12 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark focus:border-primary focus:ring-2 focus:ring-primary/20 px-4"
                  placeholder="Pakistan"
                  value="Pakistan"
                />
              </div>
            </div>
          </div>
          
          <!-- Additional Information -->
          <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6">
            <h2 class="text-xl font-bold tracking-tight text-text-primary-light dark:text-text-primary-dark pb-4 border-b border-border-light dark:border-border-dark mb-6">Additional Information</h2>
            <div class="grid grid-cols-1 gap-6">
              <div class="flex flex-col">
                <label class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2" for="website">Website</label>
                <input 
                  type="url"
                  id="website"
                  name="website"
                  class="form-input h-12 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark focus:border-primary focus:ring-2 focus:ring-primary/20 px-4"
                  placeholder="e.g., https://www.supplier.com"
                />
              </div>
              
              <div class="flex flex-col">
                <label class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2" for="notes">Notes</label>
                <textarea 
                  id="notes"
                  name="notes"
                  rows="4"
                  class="form-textarea rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark focus:border-primary focus:ring-2 focus:ring-primary/20 p-4 resize-y"
                  placeholder="Any additional notes about this supplier..."
                ></textarea>
              </div>
            </div>
          </div>
          
          <!-- Status Message -->
          <div data-form-status class="hidden items-center gap-3 rounded-lg p-4 text-sm">
            <span class="material-symbols-outlined text-lg">info</span>
            <p class="font-medium"></p>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex justify-end gap-4">
            <button 
              type="button"
              data-route="suppliers"
              class="px-6 py-3 rounded-lg bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark font-medium hover:bg-border-light dark:hover:bg-border-dark transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              data-submit-btn
              class="px-6 py-3 rounded-lg bg-primary text-white font-bold hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Supplier
            </button>
          </div>
        </form>
      </div>
    `,

    async onMount({ navigate }) {
      const form = document.querySelector("[data-supplier-form]");
      const submitBtn = document.querySelector("[data-submit-btn]");
      const statusEl = document.querySelector("[data-form-status]");
      const headingEl = document.querySelector("[data-page-heading]");

      const supplierId = sessionStorage.getItem("gms:activeSupplierId");
      const isEditMode = Boolean(supplierId);

      // Update heading for edit mode
      if (isEditMode && headingEl) {
        headingEl.textContent = "Edit Supplier";
      }

      // Load supplier for edit mode
      if (isEditMode) {
        try {
          const supplier = await suppliersService.getById(supplierId);
          populateForm(supplier);
        } catch (error) {
          console.error("Failed to load supplier:", error);
          showStatus("Failed to load supplier data", "error");
        }
      }

      function populateForm(supplier) {
        const fields = ["name", "contact_person", "phone", "email", "address", "city", "state", "postal_code", "country", "website", "notes"];
        fields.forEach((field) => {
          const input = document.getElementById(field);
          if (input && supplier[field] !== undefined && supplier[field] !== null) {
            input.value = supplier[field];
          }
        });
      }

      function showStatus(message, type = "info") {
        if (!statusEl) return;
        statusEl.classList.remove("hidden", "bg-red-50", "text-red-600", "bg-green-50", "text-green-600", "bg-blue-50", "text-blue-600", "dark:bg-red-900/20", "dark:text-red-400", "dark:bg-green-900/20", "dark:text-green-400", "dark:bg-blue-900/20", "dark:text-blue-400");
        statusEl.classList.add("flex");
        
        const icon = statusEl.querySelector(".material-symbols-outlined");
        const text = statusEl.querySelector("p");
        
        if (type === "error") {
          statusEl.classList.add("bg-red-50", "text-red-600", "dark:bg-red-900/20", "dark:text-red-400");
          if (icon) icon.textContent = "error";
        } else if (type === "success") {
          statusEl.classList.add("bg-green-50", "text-green-600", "dark:bg-green-900/20", "dark:text-green-400");
          if (icon) icon.textContent = "check_circle";
        } else {
          statusEl.classList.add("bg-blue-50", "text-blue-600", "dark:bg-blue-900/20", "dark:text-blue-400");
          if (icon) icon.textContent = "info";
        }
        
        if (text) text.textContent = message;
      }

      function toggleLoading(loading) {
        if (!submitBtn) return;
        submitBtn.disabled = loading;
        submitBtn.innerHTML = loading
          ? '<span class="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>'
          : "Save Supplier";
      }

      // Form submission
      form?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Remove empty fields
        Object.keys(data).forEach((key) => {
          if (!data[key]) delete data[key];
        });

        try {
          toggleLoading(true);
          showStatus(isEditMode ? "Updating supplier..." : "Creating supplier...", "info");

          if (isEditMode) {
            await suppliersService.update(supplierId, data);
            showStatus("Supplier updated successfully!", "success");
          } else {
            await suppliersService.create(data);
            showStatus("Supplier created successfully!", "success");
          }

          sessionStorage.removeItem("gms:activeSupplierId");
          setTimeout(() => navigate("suppliers"), 1500);
        } catch (error) {
          console.error("Failed to save supplier:", error);
          showStatus(error.message || "Failed to save supplier. Please try again.", "error");
        } finally {
          toggleLoading(false);
        }
      });

      return () => {
        sessionStorage.removeItem("gms:activeSupplierId");
      };
    },
  };
}

