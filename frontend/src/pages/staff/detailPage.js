import { usersService } from "../../services/usersService.js";

export function registerStaffDetailPage(register) {
  register("staff-detail", staffDetailPage);
}

function staffDetailPage() {
  return {
    html: `
      <div class="max-w-4xl mx-auto space-y-6">
        <!-- Page Header -->
        <div class="flex items-center gap-4">
          <button data-route="staff-list" class="flex items-center justify-center w-10 h-10 rounded-lg border border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark transition-colors">
            <span class="material-symbols-outlined">arrow_back</span>
          </button>
          <div class="flex-1">
            <h1 class="text-3xl font-black tracking-tight text-text-primary-light dark:text-text-primary-dark">Staff Member Details</h1>
            <p class="text-text-secondary-light dark:text-text-secondary-dark mt-1">View and manage staff account information.</p>
          </div>
          <button data-edit-staff class="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors">
            <span class="material-symbols-outlined text-lg">edit</span>
            Edit
          </button>
        </div>
        
        <!-- Staff Information -->
        <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6">
          <div data-staff-info class="space-y-6">
            <div class="flex items-center justify-center py-12">
              <div class="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      </div>
    `,

    async onMount({ navigate }) {
      const staffInfo = document.querySelector("[data-staff-info]");
      const editBtn = document.querySelector("[data-edit-staff]");
      
      const staffId = sessionStorage.getItem("gms:activeStaffId");
      
      if (!staffId) {
        alert("No staff member selected. Redirecting to list.");
        navigate("staff-list");
        return;
      }

      try {
        const response = await usersService.getById(staffId);
        const staff = response?.data || response;
        
        if (!staff) {
          throw new Error("Staff member not found");
        }

        const createdDate = staff.created_at 
          ? new Date(staff.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "Unknown";

        const roleBadge = {
          admin: "bg-purple-500/10 text-purple-500",
          manager: "bg-blue-500/10 text-blue-500",
          staff: "bg-green-500/10 text-green-500",
          purchasing: "bg-orange-500/10 text-orange-500",
        }[staff.role] || "bg-gray-500/10 text-gray-500";

        const roleLabel = {
          admin: "Admin",
          manager: "Manager",
          staff: "Staff (Cashier/POS Operator)",
          purchasing: "Purchasing Agent",
        }[staff.role] || staff.role;

        staffInfo.innerHTML = `
          <!-- Basic Information -->
          <div>
            <h2 class="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">Basic Information</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Full Name</label>
                <p class="text-lg font-medium text-text-primary-light dark:text-text-primary-dark mt-1">${staff.name || "N/A"}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Email Address</label>
                <p class="text-lg font-medium text-text-primary-light dark:text-text-primary-dark mt-1">${staff.email || "N/A"}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Role</label>
                <div class="mt-1">
                  <span class="inline-flex items-center rounded-full ${roleBadge} px-3 py-1 text-sm font-medium">
                    ${roleLabel}
                  </span>
                </div>
              </div>
              <div>
                <label class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Account Created</label>
                <p class="text-lg font-medium text-text-primary-light dark:text-text-primary-dark mt-1">${createdDate}</p>
              </div>
            </div>
          </div>
        `;

        editBtn?.addEventListener("click", () => {
          navigate("staff-form");
        });

      } catch (error) {
        console.error("Failed to load staff:", error);
        staffInfo.innerHTML = `
          <div class="text-center py-12">
            <span class="material-symbols-outlined text-5xl text-danger mb-4 block">error</span>
            <p class="text-lg font-medium text-text-primary-light dark:text-text-primary-dark">Failed to load staff member</p>
            <p class="text-text-secondary-light dark:text-text-secondary-dark mt-1">${error.message || "Please try again later."}</p>
            <button data-route="staff-list" class="mt-4 px-6 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors">
              Back to Staff List
            </button>
          </div>
        `;
      }
    },
  };
}

