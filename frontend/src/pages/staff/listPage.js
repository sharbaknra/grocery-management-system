import { usersService } from "../../services/usersService.js";

export function registerStaffListPage(register) {
  register("staff-list", staffListPage);
}

function staffListPage() {
  return {
    html: `
      <div class="max-w-7xl mx-auto space-y-6">
        <!-- Page Header -->
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 class="text-3xl font-black tracking-tight text-text-primary-light dark:text-text-primary-dark">Manage Staff</h1>
            <p class="text-text-secondary-light dark:text-text-secondary-dark mt-1">Create and manage staff accounts and permissions.</p>
          </div>
          <button data-route="staff-form" class="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors shadow-sm">
            <span class="material-symbols-outlined text-lg">add</span>
            Add Staff Member
          </button>
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
                placeholder="Search by name or email..."
              />
            </div>
          </div>
          <select data-role-filter class="px-4 py-3 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark">
            <option value="">All Roles</option>
            <option value="staff">Staff</option>
            <option value="purchasing">Purchasing Agent</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        
        <!-- Staff Table -->
        <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="border-b border-border-light dark:border-border-dark">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Name</th>
                  <th class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Email</th>
                  <th class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Role</th>
                  <th class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Created</th>
                  <th class="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Actions</th>
                </tr>
              </thead>
              <tbody data-staff-table class="divide-y divide-border-light dark:divide-border-dark">
                <tr>
                  <td colspan="5" class="px-6 py-12 text-center">
                    <div class="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                    <p class="text-text-secondary-light dark:text-text-secondary-dark">Loading staff members...</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `,

    async onMount({ navigate }) {
      const searchInput = document.querySelector("[data-search-input]");
      const roleFilter = document.querySelector("[data-role-filter]");
      const staffTable = document.querySelector("[data-staff-table]");
      
      let allStaff = [];
      let debounceTimer = null;

      async function loadStaff() {
        try {
          renderLoading();
          const response = await usersService.list();
          allStaff = Array.isArray(response) ? response : (response.data || []);
          applyFilters();
        } catch (error) {
          console.error("Failed to load staff:", error);
          renderError("Failed to load staff members. Please try again.");
        }
      }

      function renderLoading() {
        if (!staffTable) return;
        staffTable.innerHTML = `
          <tr>
            <td colspan="5" class="px-6 py-12 text-center">
              <div class="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
              <p class="text-text-secondary-light dark:text-text-secondary-dark">Loading staff members...</p>
            </td>
          </tr>
        `;
      }

      function renderError(message) {
        if (!staffTable) return;
        staffTable.innerHTML = `
          <tr>
            <td colspan="5" class="px-6 py-12 text-center">
              <span class="material-symbols-outlined text-5xl text-danger mb-4 block">error</span>
              <p class="text-text-secondary-light dark:text-text-secondary-dark">${message}</p>
            </td>
          </tr>
        `;
      }

      function applyFilters() {
        const searchTerm = searchInput?.value?.toLowerCase() || "";
        const roleFilterValue = roleFilter?.value || "";

        // Filter to only show staff roles (exclude customers)
        const staffRoles = ["admin", "manager", "staff", "purchasing"];
        const staffOnly = allStaff.filter((staff) => staffRoles.includes(staff.role));

        const filtered = staffOnly.filter((staff) => {
          const matchesSearch = !searchTerm || 
            (staff.name || "").toLowerCase().includes(searchTerm) ||
            (staff.email || "").toLowerCase().includes(searchTerm);
          
          const matchesRole = !roleFilterValue || staff.role === roleFilterValue;
          
          return matchesSearch && matchesRole;
        });

        renderStaff(filtered);
      }

      function renderStaff(staffList) {
        if (!staffTable) return;

        if (!staffList.length) {
          staffTable.innerHTML = `
            <tr>
              <td colspan="5" class="px-6 py-12 text-center">
                <span class="material-symbols-outlined text-5xl text-text-secondary-light dark:text-text-secondary-dark mb-4 block">people</span>
                <p class="text-lg font-medium text-text-primary-light dark:text-text-primary-dark">No staff members found</p>
                <p class="text-text-secondary-light dark:text-text-secondary-dark mt-1">Try adjusting your search or filters</p>
              </td>
            </tr>
          `;
          return;
        }

        staffTable.innerHTML = staffList.map((staff) => {
          const createdDate = staff.created_at 
            ? new Date(staff.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "-";

          const roleBadge = {
            admin: "bg-purple-500/10 text-purple-500",
            manager: "bg-blue-500/10 text-blue-500",
            staff: "bg-green-500/10 text-green-500",
            purchasing: "bg-orange-500/10 text-orange-500",
          }[staff.role] || "bg-gray-500/10 text-gray-500";

          const roleLabel = {
            admin: "Admin",
            manager: "Manager",
            staff: "Staff",
            purchasing: "Purchasing Agent",
          }[staff.role] || staff.role;

          return `
            <tr class="hover:bg-background-light dark:hover:bg-background-dark transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">${staff.name || "N/A"}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-text-secondary-light dark:text-text-secondary-dark">${staff.email || "N/A"}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center rounded-full ${roleBadge} px-2.5 py-1 text-xs font-medium">
                  ${roleLabel}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-text-secondary-light dark:text-text-secondary-dark">${createdDate}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <div class="flex items-center justify-end gap-2">
                  <button 
                    data-view-staff="${staff.id}"
                    class="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-primary/10 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors"
                    title="View Details"
                  >
                    <span class="material-symbols-outlined text-lg">visibility</span>
                  </button>
                  <button 
                    data-edit-staff="${staff.id}"
                    class="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-primary/10 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors"
                    title="Edit"
                  >
                    <span class="material-symbols-outlined text-lg">edit</span>
                  </button>
                  <button 
                    data-delete-staff="${staff.id}"
                    class="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-danger/10 text-danger transition-colors"
                    title="Delete"
                  >
                    <span class="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </td>
            </tr>
          `;
        }).join("");

        // Attach event handlers
        document.querySelectorAll("[data-view-staff]").forEach((btn) => {
          btn.addEventListener("click", () => {
            const id = btn.dataset.viewStaff;
            sessionStorage.setItem("gms:activeStaffId", id);
            navigate("staff-detail");
          });
        });

        document.querySelectorAll("[data-edit-staff]").forEach((btn) => {
          btn.addEventListener("click", () => {
            const id = btn.dataset.editStaff;
            sessionStorage.setItem("gms:activeStaffId", id);
            navigate("staff-form");
          });
        });

        document.querySelectorAll("[data-delete-staff]").forEach((btn) => {
          btn.addEventListener("click", async () => {
            const id = btn.dataset.deleteStaff;
            const staff = allStaff.find((s) => s.id === parseInt(id));
            
            if (confirm(`Are you sure you want to delete ${staff?.name || "this staff member"}? This action cannot be undone.`)) {
              try {
                await usersService.delete(id);
                await loadStaff();
              } catch (error) {
                console.error("Failed to delete staff:", error);
                alert("Failed to delete staff member. Please try again.");
              }
            }
          });
        });
      }

      // Search with debounce
      searchInput?.addEventListener("input", () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(applyFilters, 300);
      });

      // Role filter
      roleFilter?.addEventListener("change", applyFilters);

      // Initial load
      await loadStaff();

      return () => {
        clearTimeout(debounceTimer);
      };
    },
  };
}

