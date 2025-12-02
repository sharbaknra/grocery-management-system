import { authService } from "../../services/authService.js";
import { cartService } from "../../services/cartService.js";

export function registerLoginPage(register) {
  register("login", loginPage);
}

function loginPage() {
  return {
    html: `
      <div class="relative flex min-h-screen w-full flex-col items-center justify-center p-4 bg-background-light dark:bg-background-dark">
        <!-- Header -->
        <header class="absolute top-0 flex w-full items-center justify-center p-6 sm:p-8">
          <div class="flex items-center gap-3 text-text-primary-light dark:text-text-primary-dark">
            <div class="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <span class="material-symbols-outlined text-white text-2xl">storefront</span>
            </div>
            <h2 class="text-2xl font-bold leading-tight tracking-tight">Grocery MS</h2>
          </div>
        </header>
        
        <!-- Main Content -->
        <main class="flex w-full max-w-md flex-col items-center">
          <!-- Login Card -->
          <div class="w-full rounded-2xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-6 shadow-lg sm:p-8">
            <div class="flex flex-col items-center">
              <h1 class="text-2xl font-bold leading-tight tracking-tight text-text-primary-light dark:text-text-primary-dark sm:text-3xl">Welcome Back</h1>
              <p class="mt-1 text-center text-sm text-text-secondary-light dark:text-text-secondary-dark">Sign in to manage your grocery inventory.</p>
            </div>
            
            <form data-auth-form="login" class="mt-6 space-y-5">
              <!-- Status Message -->
              <div data-auth-status class="hidden items-center gap-3 rounded-lg p-3 text-sm">
                <span class="material-symbols-outlined text-lg">info</span>
                <p class="font-medium"></p>
              </div>
              
              <!-- Email Field -->
              <div class="flex flex-col">
                <label class="mb-2 text-sm font-medium text-text-primary-light dark:text-text-primary-dark" for="email">Email Address</label>
                <input 
                  class="form-input h-12 w-full rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-3 text-text-primary-light dark:text-text-primary-dark placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors" 
                  id="email" 
                  name="email"
                  type="email" 
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <!-- Password Field -->
              <div class="flex flex-col">
                <label class="mb-2 text-sm font-medium text-text-primary-light dark:text-text-primary-dark" for="password">Password</label>
                <div class="relative flex w-full items-stretch">
                  <input 
                    class="form-input h-12 flex-1 rounded-l-lg border border-r-0 border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-3 text-text-primary-light dark:text-text-primary-dark placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark focus:z-10 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors" 
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
                  >
                    <span class="material-symbols-outlined text-xl">visibility</span>
                  </button>
                </div>
              </div>
              
              <!-- Remember Me -->
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <input 
                    class="form-checkbox h-4 w-4 rounded border-border-light dark:border-border-dark text-primary focus:ring-primary dark:bg-background-dark" 
                    id="remember-me" 
                    name="remember"
                    type="checkbox"
                  />
                  <label class="ml-2 text-sm text-text-secondary-light dark:text-text-secondary-dark" for="remember-me">Remember me</label>
                </div>
              </div>
              
              <!-- Login Button -->
              <button 
                type="submit"
                data-auth-submit
                class="w-full rounded-lg bg-primary px-5 py-3 text-center text-sm font-bold text-white hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Log In
              </button>
            </form>
            
            <!-- Register Link -->
            <div class="mt-6 text-center">
              <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                Don't have an account? 
                <button data-route="register" class="font-medium text-primary hover:underline">Sign up</button>
              </p>
            </div>
          </div>
        </main>
        
        <!-- Footer -->
        <footer class="absolute bottom-0 w-full p-6 sm:p-8">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 rounded-full bg-surface-light dark:bg-surface-dark px-3 py-1.5 text-sm shadow-sm border border-border-light dark:border-border-dark">
              <div class="w-2 h-2 rounded-full bg-success animate-pulse"></div>
              <span class="font-medium text-text-secondary-light dark:text-text-secondary-dark">Status:</span>
              <span class="text-text-primary-light dark:text-text-primary-dark">Online</span>
            </div>
            <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark">© 2025 Grocery Management System - Made by Saad Ali</p>
          </div>
        </footer>
      </div>
    `,

    onMount({ navigate }) {
      const form = document.querySelector("[data-auth-form='login']");
      const statusNode = document.querySelector("[data-auth-status]");
      const submitBtn = document.querySelector("[data-auth-submit]");
      const togglePasswordBtn = document.querySelector("[data-toggle-password]");
      const passwordInput = document.getElementById("password");

      // Toggle password visibility
      togglePasswordBtn?.addEventListener("click", () => {
        const isPassword = passwordInput.type === "password";
        passwordInput.type = isPassword ? "text" : "password";
        const icon = togglePasswordBtn.querySelector(".material-symbols-outlined");
        if (icon) {
          icon.textContent = isPassword ? "visibility_off" : "visibility";
        }
      });

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
      };
    },
  };
}
