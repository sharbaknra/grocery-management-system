import { getState } from "../../state/appState.js";

export function registerSettingsPage(register) {
  register("settings", settingsPage);
}

function settingsPage() {
  return {
    html: `
      <div class="max-w-4xl mx-auto space-y-6">
        <!-- Page Header -->
        <div>
          <h1 class="text-3xl font-black tracking-tight text-text-primary-light dark:text-text-primary-dark">Settings</h1>
          <p class="text-text-secondary-light dark:text-text-secondary-dark mt-1">Manage your account and application preferences.</p>
        </div>
        
        <!-- Profile Section -->
        <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6">
          <h2 class="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6">Profile</h2>
          
          <div class="flex items-start gap-6">
            <div class="flex items-center justify-center w-20 h-20 rounded-full bg-primary text-white text-2xl font-bold" data-user-initials>
              GU
            </div>
            <div class="flex-1 space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2 block">Full Name</label>
                  <input 
                    type="text"
                    data-user-name
                    class="form-input w-full h-11 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark focus:border-primary focus:ring-2 focus:ring-primary/20 px-4"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2 block">Email</label>
                  <input 
                    type="email"
                    data-user-email
                    class="form-input w-full h-11 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark focus:border-primary focus:ring-2 focus:ring-primary/20 px-4"
                    placeholder="your@email.com"
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div class="flex justify-end mt-6 pt-6 border-t border-border-light dark:border-border-dark">
            <button class="px-4 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors disabled:opacity-50" disabled>
              Save Changes
            </button>
          </div>
        </div>
        
        <!-- Appearance Section -->
        <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6">
          <h2 class="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6">Appearance</h2>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-text-primary-light dark:text-text-primary-dark">Dark Mode</p>
                <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">Switch between light and dark themes</p>
              </div>
              <button 
                data-toggle-theme
                class="relative inline-flex h-6 w-11 items-center rounded-full bg-border-light dark:bg-primary transition-colors"
              >
                <span class="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform translate-x-1 dark:translate-x-6"></span>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Notifications Section -->
        <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6">
          <h2 class="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6">Notifications</h2>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-text-primary-light dark:text-text-primary-dark">Low Stock Alerts</p>
                <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">Get notified when products are running low</p>
              </div>
              <input type="checkbox" checked class="form-checkbox h-5 w-5 rounded text-primary focus:ring-primary" />
            </div>
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-text-primary-light dark:text-text-primary-dark">Expiry Alerts</p>
                <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">Get notified about products expiring soon</p>
              </div>
              <input type="checkbox" checked class="form-checkbox h-5 w-5 rounded text-primary focus:ring-primary" />
            </div>
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-text-primary-light dark:text-text-primary-dark">Order Confirmations</p>
                <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">Receive confirmation for completed orders</p>
              </div>
              <input type="checkbox" class="form-checkbox h-5 w-5 rounded text-primary focus:ring-primary" />
            </div>
          </div>
        </div>
        
        <!-- Danger Zone -->
        <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-danger/30 p-6">
          <h2 class="text-xl font-bold text-danger mb-6">Danger Zone</h2>
          
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium text-text-primary-light dark:text-text-primary-dark">Delete Account</p>
              <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">Permanently delete your account and all data</p>
            </div>
            <button class="px-4 py-2 rounded-lg border border-danger text-danger font-medium hover:bg-danger/10 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
        
        <!-- App Info -->
        <div class="text-center py-4">
          <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">
            Grocery Management System v1.0.0 • © 2025 Made by Saad Ali
          </p>
        </div>
      </div>
    `,

    onMount() {
      const state = getState();
      const user = state.user || {};

      // Populate user data
      const nameInput = document.querySelector("[data-user-name]");
      const emailInput = document.querySelector("[data-user-email]");
      const initialsEl = document.querySelector("[data-user-initials]");

      if (nameInput) nameInput.value = user.name || "";
      if (emailInput) emailInput.value = user.email || "";
      if (initialsEl) {
        initialsEl.textContent = computeInitials(user.name);
      }

      // Theme toggle
      const themeToggle = document.querySelector("[data-toggle-theme]");
      themeToggle?.addEventListener("click", () => {
        document.documentElement.classList.toggle("dark");
        const isDark = document.documentElement.classList.contains("dark");
        localStorage.setItem("gms:theme", isDark ? "dark" : "light");
      });

      // Load saved theme
      const savedTheme = localStorage.getItem("gms:theme");
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      }
    },
  };
}

function computeInitials(name) {
  if (!name) return "GU";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}
