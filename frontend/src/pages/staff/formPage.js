import { usersService } from "../../services/usersService.js";

export function registerStaffFormPage(register) {
  register("staff-form", staffFormPage);
}

function staffFormPage() {
  return {
    html: `
      <div class="max-w-3xl mx-auto space-y-6">
        <!-- Page Header -->
        <div class="flex items-center gap-4">
          <button data-route="staff-list" class="flex items-center justify-center w-10 h-10 rounded-lg border border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark transition-colors">
            <span class="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 data-page-heading class="text-3xl font-black tracking-tight text-text-primary-light dark:text-text-primary-dark">Add New Staff Member</h1>
            <p class="text-text-secondary-light dark:text-text-secondary-dark mt-1">Fill in the details below to create a new staff account.</p>
          </div>
        </div>
        
        <!-- Form -->
        <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6">
          <form data-staff-form class="space-y-6">
            <!-- Name -->
            <div>
              <label class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2 block" for="name">
                Full Name <span class="text-danger">*</span>
              </label>
              <input 
                type="text"
                id="name"
                name="name"
                required
                class="form-input w-full h-12 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark focus:border-primary focus:ring-2 focus:ring-primary/20 px-4"
                placeholder="Enter full name"
              />
            </div>
            
            <!-- Email -->
            <div>
              <label class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2 block" for="email">
                Email Address <span class="text-danger">*</span>
              </label>
              <input 
                type="email"
                id="email"
                name="email"
                required
                class="form-input w-full h-12 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark focus:border-primary focus:ring-2 focus:ring-primary/20 px-4"
                placeholder="Enter email address"
              />
            </div>
            
            <!-- Password -->
            <div>
              <label class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2 block" for="password">
                Password <span class="text-danger">*</span>
              </label>
              <input 
                type="password"
                id="password"
                name="password"
                required
                class="form-input w-full h-12 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark focus:border-primary focus:ring-2 focus:ring-primary/20 px-4"
                placeholder="Enter password (min 6 characters)"
                minlength="6"
              />
            </div>
            
            <!-- Role -->
            <div>
              <label class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2 block" for="role">
                Role <span class="text-danger">*</span>
              </label>
              <select 
                id="role"
                name="role"
                required
                class="form-select w-full h-12 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark focus:border-primary focus:ring-2 focus:ring-primary/20 px-4"
              >
                <option value="">Select a role</option>
                <option value="staff">Staff (Cashier/POS Operator)</option>
                <option value="purchasing">Purchasing Agent</option>
              </select>
            </div>
            
            <!-- Status Message -->
            <div data-form-status class="hidden items-center gap-3 rounded-lg p-3 text-sm">
              <span class="material-symbols-outlined text-lg"></span>
              <p class="font-medium"></p>
            </div>
            
            <!-- Actions -->
            <div class="flex justify-end gap-3 pt-4">
              <button 
                type="button"
                data-route="staff-list"
                class="px-6 py-2.5 rounded-lg bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark font-medium hover:bg-border-light dark:hover:bg-border-dark transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                data-form-submit
                class="px-6 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors disabled:opacity-50"
              >
                Create Staff Member
              </button>
            </div>
          </form>
        </div>
      </div>
    `,

    async onMount({ navigate }) {
      const form = document.querySelector("[data-staff-form]");
      const submitBtn = document.querySelector("[data-form-submit]");
      const statusEl = document.querySelector("[data-form-status]");
      const pageHeading = document.querySelector("[data-page-heading]");
      
      // Check if editing existing staff
      const staffId = sessionStorage.getItem("gms:activeStaffId");
      let isEditMode = false;
      let existingStaff = null;

      if (staffId) {
        isEditMode = true;
        try {
          const response = await usersService.getById(staffId);
          existingStaff = response?.data || response;
          
          if (existingStaff) {
            // Populate form
            form.querySelector("[name='name']").value = existingStaff.name || "";
            form.querySelector("[name='email']").value = existingStaff.email || "";
            form.querySelector("[name='role']").value = existingStaff.role || "";
            
            // Update UI for edit mode
            pageHeading.textContent = "Edit Staff Member";
            submitBtn.textContent = "Update Staff Member";
            form.querySelector("label[for='password']").innerHTML = 'Password <span class="text-text-secondary-light dark:text-text-secondary-dark">(leave blank to keep current)</span>';
            form.querySelector("[name='password']").removeAttribute("required");
          }
        } catch (error) {
          console.error("Failed to load staff:", error);
          alert("Failed to load staff member. Redirecting to list.");
          navigate("staff-list");
          return;
        }
      }

      form?.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = {
          name: formData.get("name"),
          email: formData.get("email"),
          role: formData.get("role"),
        };

        // Only include password if provided (for edit mode)
        const password = formData.get("password");
        if (password) {
          data.password = password;
        }

        try {
          submitBtn.disabled = true;
          submitBtn.textContent = isEditMode ? "Updating..." : "Creating...";
          
          if (statusEl) {
            statusEl.classList.add("hidden");
          }

          if (isEditMode && existingStaff) {
            await usersService.update(staffId, data);
            showStatus("success", "Staff member updated successfully!");
          } else {
            if (!data.password) {
              showStatus("error", "Password is required for new staff members.");
              submitBtn.disabled = false;
              submitBtn.textContent = "Create Staff Member";
              return;
            }
            await usersService.createStaff(data);
            showStatus("success", "Staff member created successfully!");
          }

          // Clear session storage
          sessionStorage.removeItem("gms:activeStaffId");
          
          // Redirect after delay
          setTimeout(() => {
            navigate("staff-list");
          }, 1500);
        } catch (error) {
          console.error("Failed to save staff:", error);
          const errorMessage = error.message || "Failed to save staff member. Please try again.";
          showStatus("error", errorMessage);
          submitBtn.disabled = false;
          submitBtn.textContent = isEditMode ? "Update Staff Member" : "Create Staff Member";
        }
      });

      function showStatus(type, message) {
        if (!statusEl) return;
        
        statusEl.classList.remove("hidden");
        statusEl.classList.remove("bg-red-50", "text-red-600", "bg-green-50", "text-green-600");
        
        const icon = statusEl.querySelector(".material-symbols-outlined");
        const text = statusEl.querySelector("p");
        
        if (type === "success") {
          statusEl.classList.add("bg-green-50", "text-green-600");
          if (icon) icon.textContent = "check_circle";
          if (text) text.textContent = message;
        } else {
          statusEl.classList.add("bg-red-50", "text-red-600");
          if (icon) icon.textContent = "error";
          if (text) text.textContent = message;
        }
      }
    },
  };
}

