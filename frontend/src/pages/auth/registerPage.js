import { authService } from "../../services/authService.js";

export function registerRegisterPage(register) {
  register("register", registerPage);
}

function registerPage() {
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
          <div class="w-full rounded-2xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-6 shadow-lg sm:p-8">
            <div class="flex flex-col items-center">
              <h1 class="text-2xl font-bold leading-tight tracking-tight text-text-primary-light dark:text-text-primary-dark sm:text-3xl">Create Account</h1>
              <p class="mt-1 text-center text-sm text-text-secondary-light dark:text-text-secondary-dark">Start managing your grocery inventory today.</p>
            </div>
            
            <form data-auth-form="register" class="mt-6 space-y-5">
              <!-- Status Message -->
              <div data-auth-status class="hidden items-center gap-3 rounded-lg p-3 text-sm">
                <span class="material-symbols-outlined text-lg">info</span>
                <p class="font-medium"></p>
              </div>
              
              <!-- Name Field -->
              <div class="flex flex-col">
                <label class="mb-2 text-sm font-medium text-text-primary-light dark:text-text-primary-dark" for="name">Full Name</label>
                <input 
                  class="form-input h-12 w-full rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-3 text-text-primary-light dark:text-text-primary-dark placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors" 
                  id="name" 
                  name="name"
                  type="text" 
                  placeholder="Enter your full name"
                  required
                />
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
                <input 
                  class="form-input h-12 w-full rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-3 text-text-primary-light dark:text-text-primary-dark placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors" 
                  id="password" 
                  name="password"
                  type="password" 
                  placeholder="Create a password"
                  minlength="6"
                  required
                />
                <p class="mt-1 text-xs text-text-secondary-light dark:text-text-secondary-dark">Must be at least 6 characters</p>
              </div>
              
              <!-- Register Button -->
              <button 
                type="submit"
                data-auth-submit
                class="w-full rounded-lg bg-primary px-5 py-3 text-center text-sm font-bold text-white hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Account
              </button>
            </form>
            
            <!-- Login Link -->
            <div class="mt-6 text-center">
              <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                Already have an account? 
                <button data-route="login" class="font-medium text-primary hover:underline">Sign in</button>
              </p>
            </div>
          </div>
        </main>
        
        <!-- Footer -->
        <footer class="absolute bottom-0 w-full p-6 sm:p-8">
          <div class="flex items-center justify-center">
            <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark">© 2025 Grocery Management System - Made by Saad Ali</p>
          </div>
        </footer>
      </div>
    `,

    onMount({ navigate }) {
      const form = document.querySelector("[data-auth-form='register']");
      const statusNode = document.querySelector("[data-auth-status]");
      const submitBtn = document.querySelector("[data-auth-submit]");

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
          : "Create Account";
      }

      const handleSubmit = async (event) => {
        event.preventDefault();
        if (!form) return;

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
          toggleLoading(true);
          setStatus("Creating your account…", "info");
          await authService.register(data);
          setStatus("Account created! Redirecting to login…", "success");
          setTimeout(() => navigate("login"), 1500);
        } catch (error) {
          console.error("Registration failed:", error);
          const message = error?.message || "Unable to create account. Please try again.";
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
