import { authService } from "../../services/authService.js";
import { cartService } from "../../services/cartService.js";

export function registerLoginPage(register) {
  register("login", loginPage);
}

function loginPage() {
  return {
    html: `
      <div class="min-h-screen w-full flex flex-col bg-background-light dark:bg-background-dark">
        <!-- Header -->
        <header class="w-full flex-shrink-0 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div class="max-w-7xl mx-auto flex items-center justify-center gap-3 text-text-primary-light dark:text-text-primary-dark">
            <div class="flex items-center justify-center w-10 h-10 bg-primary rounded-lg shadow-sm">
              <span class="material-symbols-outlined text-white text-2xl">storefront</span>
            </div>
            <h2 class="text-xl sm:text-2xl font-bold leading-tight tracking-tight">Grocery MS</h2>
          </div>
        </header>
        
        <!-- Main Content - Flexible Center Section -->
        <main class="flex-1 flex items-center justify-center w-full px-4 sm:px-6 py-8 sm:py-12">
          <div class="w-full max-w-md">
            <!-- Login Card -->
            <div class="w-full rounded-2xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-6 sm:p-8 shadow-xl">
              <!-- Header Section -->
              <div class="flex flex-col items-center mb-6 sm:mb-8">
                <h1 class="text-2xl sm:text-3xl font-bold leading-tight tracking-tight text-text-primary-light dark:text-text-primary-dark text-center">
                  Welcome Back
                </h1>
                <p class="mt-2 text-center text-sm sm:text-base text-text-secondary-light dark:text-text-secondary-dark">
                  Sign in to manage your grocery inventory.
                </p>
              </div>
              
              <!-- Form Section -->
              <form data-auth-form="login" class="space-y-4 sm:space-y-5">
                <!-- Status Message -->
                <div data-auth-status class="hidden items-start gap-3 rounded-lg p-3 sm:p-4 text-sm border border-border-light dark:border-border-dark">
                  <span class="material-symbols-outlined text-lg flex-shrink-0 mt-0.5">info</span>
                  <p class="font-medium flex-1 break-words"></p>
                </div>
                
                <!-- Email Field -->
                <div class="flex flex-col space-y-2">
                  <label class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark" for="email">
                    Email Address
                  </label>
                  <input 
                    class="form-input h-12 w-full rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark px-4 text-text-primary-light dark:text-text-primary-dark placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors" 
                    id="email" 
                    name="email"
                    type="email" 
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <!-- Password Field -->
                <div class="flex flex-col space-y-2">
                  <label class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark" for="password">
                    Password
                  </label>
                  <div class="relative flex w-full items-stretch">
                    <input 
                      class="form-input h-12 flex-1 rounded-l-lg border border-r-0 border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark px-4 text-text-primary-light dark:text-text-primary-dark placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark focus:z-10 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors" 
                      id="password" 
                      name="password"
                      type="password" 
                      placeholder="Enter your password"
                      required
                    />
                    <button 
                      type="button"
                      data-toggle-password
                      class="flex items-center justify-center rounded-r-lg border border-l-0 border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark px-4 text-text-secondary-light dark:text-text-secondary-dark hover:bg-border-light dark:hover:bg-border-dark transition-colors"
                      aria-label="Toggle password visibility"
                    >
                      <span class="material-symbols-outlined text-xl">visibility</span>
                    </button>
                  </div>
                </div>
                
                <!-- Remember Me -->
                <div class="flex items-center justify-between pt-1">
                  <div class="flex items-center">
                    <input 
                      class="form-checkbox h-4 w-4 rounded border-border-light dark:border-border-dark text-primary focus:ring-primary dark:bg-background-dark cursor-pointer" 
                      id="remember-me" 
                      name="remember"
                      type="checkbox"
                    />
                    <label class="ml-2 text-sm text-text-secondary-light dark:text-text-secondary-dark cursor-pointer" for="remember-me">
                      Remember me
                    </label>
                  </div>
                </div>
                
                <!-- Login Button -->
                <button 
                  type="submit"
                  data-auth-submit
                  class="w-full rounded-lg bg-primary px-5 py-3 text-center text-sm font-bold text-white hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4 sm:mt-5"
                >
                  Log In
                </button>
              </form>
              
              <!-- Register Link -->
              <div class="mt-6 sm:mt-8 text-center">
                <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  Don't have an account? 
                  <button data-route="register" class="font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-1">
                    Sign up
                  </button>
                </p>
              </div>
              
              <!-- Quick Login Section -->
              <div data-quick-login-section class="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-border-light dark:border-border-dark">
                <p class="text-xs sm:text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-4 text-center">
                  Quick Login (Demo)
                </p>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                  <button 
                    type="button"
                    data-quick-login="manager"
                    class="flex flex-col sm:flex-row items-center justify-center gap-2 px-3 py-2.5 sm:py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-xs sm:text-sm font-medium text-text-primary-light dark:text-text-primary-dark hover:bg-primary/10 hover:border-primary transition-all group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
                    title="Store Manager Login"
                  >
                    <span class="material-symbols-outlined text-lg sm:text-xl text-primary group-hover:scale-110 transition-transform">manage_accounts</span>
                    <span class="whitespace-nowrap">Manager</span>
                  </button>
                  <button 
                    type="button"
                    data-quick-login="staff"
                    class="flex flex-col sm:flex-row items-center justify-center gap-2 px-3 py-2.5 sm:py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-xs sm:text-sm font-medium text-text-primary-light dark:text-text-primary-dark hover:bg-accent/10 hover:border-accent transition-all group cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/20"
                    title="Staff Login"
                  >
                    <span class="material-symbols-outlined text-lg sm:text-xl text-accent group-hover:scale-110 transition-transform">point_of_sale</span>
                    <span class="whitespace-nowrap">Staff</span>
                  </button>
                  <button 
                    type="button"
                    data-quick-login="purchasing"
                    class="flex flex-col sm:flex-row items-center justify-center gap-2 px-3 py-2.5 sm:py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-xs sm:text-sm font-medium text-text-primary-light dark:text-text-primary-dark hover:bg-blue-500/10 hover:border-blue-500 transition-all group cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    title="Purchasing Agent Login"
                  >
                    <span class="material-symbols-outlined text-lg sm:text-xl text-blue-500 group-hover:scale-110 transition-transform">local_shipping</span>
                    <span class="whitespace-nowrap">Purchasing</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <!-- Footer -->
        <footer class="w-full flex-shrink-0 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-t border-border-light dark:border-border-dark">
          <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div class="flex items-center gap-2 rounded-full bg-surface-light dark:bg-surface-dark px-3 py-1.5 text-xs sm:text-sm shadow-sm border border-border-light dark:border-border-dark">
              <div class="w-2 h-2 rounded-full bg-success animate-pulse"></div>
              <span class="font-medium text-text-secondary-light dark:text-text-secondary-dark">Status:</span>
              <span class="text-text-primary-light dark:text-text-primary-dark">Online</span>
            </div>
            <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark text-center sm:text-right">
              © 2025 Grocery Management System - Made by Saad Ali
            </p>
          </div>
        </footer>
      </div>
    `,

    onMount({ navigate, params = {} }) {
      const form = document.querySelector("[data-auth-form='login']");
      const statusNode = document.querySelector("[data-auth-status]");
      const submitBtn = document.querySelector("[data-auth-submit]");
      const togglePasswordBtn = document.querySelector("[data-toggle-password]");
      const passwordInput = document.getElementById("password");
      const emailInput = document.getElementById("email");
      
      // Get role from params (if coming from home page)
      const selectedRole = params?.role;
      
      // Function to attach quick login event listeners using event delegation
      let quickLoginHandler = null;
      function attachQuickLoginListeners() {
        const quickLoginSection = document.querySelector("[data-quick-login-section]");
        if (quickLoginSection) {
          // Remove existing listener if any
          if (quickLoginHandler) {
            quickLoginSection.removeEventListener("click", quickLoginHandler);
          }
          
          // Create new handler function
          quickLoginHandler = (e) => {
            const button = e.target.closest("[data-quick-login]");
            if (button && !button.classList.contains("hidden") && button.type === "button") {
              e.preventDefault();
              e.stopPropagation();
              const role = button.dataset.quickLogin;
              console.log("Quick login clicked:", role); // Debug log
              if (role) {
                handleQuickLogin(role);
              }
            }
          };
          
          // Attach event listener using event delegation
          quickLoginSection.addEventListener("click", quickLoginHandler);
        }
      }
      
      // Use setTimeout to ensure DOM is fully rendered
      setTimeout(() => {
        // Hide/show quick login buttons based on role
        const quickLoginSection = document.querySelector("[data-quick-login-section]");
        const quickLoginContainer = quickLoginSection?.querySelector(".grid");
        const allButtons = document.querySelectorAll("[data-quick-login]");
        
        if (quickLoginSection && selectedRole && allButtons.length > 0) {
          // Hide all buttons first by adding hidden class
          allButtons.forEach(btn => {
            btn.classList.add("hidden");
          });
          // Show only the selected role's button
          const targetButton = document.querySelector(`[data-quick-login="${selectedRole}"]`);
          if (targetButton) {
            targetButton.classList.remove("hidden");
            // Update container to single column when only one button
            if (quickLoginContainer) {
              quickLoginContainer.classList.remove("sm:grid-cols-3");
              quickLoginContainer.classList.add("sm:grid-cols-1");
            }
            // Update the section title
            const title = quickLoginSection.querySelector("p");
            if (title) {
              const roleNames = {
                manager: "Store Manager",
                staff: "Staff",
                purchasing: "Purchasing Agent"
              };
              title.textContent = `Quick Login - ${roleNames[selectedRole] || selectedRole}`;
            }
          }
        } else if (quickLoginSection && !selectedRole) {
          // No role specified - show all buttons (direct navigation to login)
          allButtons.forEach(btn => {
            btn.classList.remove("hidden");
          });
          // Ensure grid is 3 columns
          if (quickLoginContainer) {
            quickLoginContainer.classList.remove("sm:grid-cols-1");
            quickLoginContainer.classList.add("sm:grid-cols-3");
          }
        }
        
        // Attach event listeners AFTER DOM manipulation
        attachQuickLoginListeners();
      }, 0);

      function setStatus(message, type = "info") {
        if (!statusNode) return;
        statusNode.classList.remove("hidden", "bg-red-50", "text-red-600", "bg-green-50", "text-green-600", "bg-blue-50", "text-blue-600", "dark:bg-red-900/20", "dark:text-red-400", "dark:bg-green-900/20", "dark:text-green-400", "dark:bg-blue-900/20", "dark:text-blue-400");
        statusNode.classList.add("flex");
        
        const icon = statusNode.querySelector(".material-symbols-outlined");
        const text = statusNode.querySelector("p");
        
        if (type === "error") {
          statusNode.classList.add("bg-red-50", "text-red-600", "dark:bg-red-900/20", "dark:text-red-400");
          if (icon) icon.textContent = "error";
        } else if (type === "success") {
          statusNode.classList.add("bg-green-50", "text-green-600", "dark:bg-green-900/20", "dark:text-green-400");
          if (icon) icon.textContent = "check_circle";
        } else {
          statusNode.classList.add("bg-blue-50", "text-blue-600", "dark:bg-blue-900/20", "dark:text-blue-400");
          if (icon) icon.textContent = "info";
        }
        
        if (text) text.textContent = message;
      }

      function toggleLoading(loading) {
        if (!submitBtn) return;
        submitBtn.disabled = loading;
        submitBtn.innerHTML = loading
          ? '<span class="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>'
          : "Log In";
      }

      // Quick login credentials
      const quickLoginCredentials = {
        manager: {
          email: "admin@grocery.com",
          password: "admin123",
          role: "Store Manager"
        },
        staff: {
          email: "staff@grocery.com",
          password: "staff123",
          role: "Staff"
        },
        purchasing: {
          email: "purchasing@grocery.com",
          password: "purchasing123",
          role: "Purchasing Agent"
        }
      };

      // Quick login handler
      const handleQuickLogin = async (role) => {
        const credentials = quickLoginCredentials[role];
        if (!credentials) return;

        try {
          // Fill in the form fields
          if (emailInput) emailInput.value = credentials.email;
          if (passwordInput) passwordInput.value = credentials.password;

          // Show status
          setStatus(`Logging in as ${credentials.role}...`, "info");

          // Disable submit button and show loading
          toggleLoading(true);

          // Perform login
          const result = await authService.login({
            email: credentials.email,
            password: credentials.password
          });
          
          await cartService.getCart().catch(() => {});
          setStatus(`Success! Logged in as ${credentials.role}`, "success");
          
          // Redirect based on role
          const dashboards = {
            admin: "manager-dashboard",
            manager: "manager-dashboard",
            staff: "pos",
            purchasing: "purchasing-dashboard",
          };
          const targetDashboard = dashboards[result?.user?.role] || "pos";
          setTimeout(() => navigate(targetDashboard), 500);
        } catch (error) {
          console.error("Quick login failed:", error);
          const message = error?.message || "Login failed. Please try again.";
          setStatus(message, "error");
          toggleLoading(false);
        }
      };

      // Event listeners will be attached in setTimeout after DOM manipulation

      // Toggle password visibility
      togglePasswordBtn?.addEventListener("click", () => {
        const isPassword = passwordInput.type === "password";
        passwordInput.type = isPassword ? "text" : "password";
        const icon = togglePasswordBtn.querySelector(".material-symbols-outlined");
        if (icon) {
          icon.textContent = isPassword ? "visibility_off" : "visibility";
        }
      });

      const handleSubmit = async (event) => {
        event.preventDefault();
        if (!form) return;

        const formData = new FormData(form);
        const credentials = Object.fromEntries(formData.entries());

        try {
          toggleLoading(true);
          setStatus("Signing in…", "info");
          const result = await authService.login(credentials);
          await cartService.getCart().catch(() => {});
          setStatus("Success! Redirecting…", "success");
          
          // Redirect based on role
          const role = result?.user?.role || "staff";
          const dashboards = {
            admin: "manager-dashboard",
            manager: "manager-dashboard",
            staff: "pos",
            purchasing: "purchasing-dashboard",
          };
          const targetDashboard = dashboards[role] || "pos";
          setTimeout(() => navigate(targetDashboard), 500);
        } catch (error) {
          console.error("Login failed:", error);
          const message = error?.message || "Invalid email or password. Please try again.";
          setStatus(message, "error");
        } finally {
          toggleLoading(false);
        }
      };

      form?.addEventListener("submit", handleSubmit);
      
      return () => {
        form?.removeEventListener("submit", handleSubmit);
        // Cleanup quick login listener
        const quickLoginSection = document.querySelector("[data-quick-login-section]");
        if (quickLoginSection && quickLoginHandler) {
          quickLoginSection.removeEventListener("click", quickLoginHandler);
        }
      };
    },
  };
}
