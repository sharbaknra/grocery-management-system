export function registerHomePage(register) {
  register("home", homePage);
}

function homePage() {
  return {
    html: `
      <div class="min-h-screen bg-gradient-to-br from-background-light via-surface-light to-secondary/10 dark:from-background-dark dark:via-surface-dark dark:to-secondary/5">
        <!-- Navigation -->
        <nav class="fixed top-0 left-0 right-0 z-50 bg-surface-light/90 dark:bg-surface-dark/90 backdrop-blur-md border-b border-border-light dark:border-border-dark">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
              <div class="flex items-center gap-3">
                <div class="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl shadow-lg">
                  <span class="text-white text-xl">🛒</span>
                </div>
                <div>
                  <span class="font-black text-xl text-text-primary-light dark:text-text-primary-dark">Grocery</span>
                  <span class="font-black text-xl text-primary">MS</span>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <button data-route="login" class="px-5 py-2.5 text-sm font-semibold text-text-primary-light dark:text-text-primary-dark hover:text-primary transition-colors">
                  Log In
                </button>
              </div>
            </div>
          </div>
        </nav>

        <!-- Hero Section -->
        <section class="relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden">
          <!-- Background decorations -->
          <div class="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
          <div class="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
          
          <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center max-w-4xl mx-auto">
              <!-- Badge -->
              <div class="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-8">
                <span class="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                <span class="text-sm font-medium text-primary">Grocery Management System</span>
              </div>
              
              <!-- Main Heading -->
              <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black text-text-primary-light dark:text-text-primary-dark leading-tight mb-6">
                Complete Store
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">Management</span>
                <br/>Solution
              </h1>
              
              <!-- Subtitle -->
              <p class="text-lg text-text-secondary-light dark:text-text-secondary-dark max-w-2xl mx-auto mb-12">
                A unified platform for inventory management, point-of-sale operations, supplier tracking, and comprehensive reporting.
              </p>
            </div>
          </div>
        </section>

        <!-- Role Cards Section -->
        <section class="py-16 lg:py-24">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
              <h2 class="text-3xl lg:text-4xl font-black text-text-primary-light dark:text-text-primary-dark mb-4">
                Select Your Role
              </h2>
              <p class="text-lg text-text-secondary-light dark:text-text-secondary-dark">
                Access the system based on your responsibilities
              </p>
            </div>
            
            <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <!-- Store Manager -->
              <div class="group relative bg-surface-light dark:bg-surface-dark rounded-2xl border-2 border-border-light dark:border-border-dark hover:border-primary p-8 transition-all hover:shadow-2xl hover:-translate-y-1 h-full flex flex-col">
                <div class="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full"></div>
                <div class="relative flex flex-col flex-1">
                  <div class="w-16 h-16 bg-gradient-to-br from-primary to-primary-hover rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <span class="material-symbols-outlined text-3xl text-white">admin_panel_settings</span>
                  </div>
                  <h3 class="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-3">Store Manager</h3>
                  <p class="text-text-secondary-light dark:text-text-secondary-dark mb-6">
                    Full access to inventory, pricing, reports, and staff management.
                  </p>
                  <ul class="space-y-2 mb-8 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    <li class="flex items-center gap-2">
                      <span class="material-symbols-outlined text-success text-lg">check_circle</span>
                      Manage products & pricing
                    </li>
                    <li class="flex items-center gap-2">
                      <span class="material-symbols-outlined text-success text-lg">check_circle</span>
                      View sales reports
                    </li>
                    <li class="flex items-center gap-2">
                      <span class="material-symbols-outlined text-success text-lg">check_circle</span>
                      Monitor stock levels
                    </li>
                    <li class="flex items-center gap-2">
                      <span class="material-symbols-outlined text-success text-lg">check_circle</span>
                      Manage suppliers
                    </li>
                  </ul>
                  <button 
                    data-route="login" 
                    data-route-params='{"role":"manager"}'
                    class="w-full mt-auto flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-colors">
                    <span>Manager Login</span>
                    <span class="material-symbols-outlined">arrow_forward</span>
                  </button>
                </div>
              </div>
              
              <!-- Staff -->
              <div class="group relative bg-surface-light dark:bg-surface-dark rounded-2xl border-2 border-border-light dark:border-border-dark hover:border-accent p-8 transition-all hover:shadow-2xl hover:-translate-y-1 h-full flex flex-col">
                <div class="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full"></div>
                <div class="relative flex flex-col flex-1">
                  <div class="w-16 h-16 bg-gradient-to-br from-accent to-amber-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <span class="material-symbols-outlined text-3xl text-white">point_of_sale</span>
                  </div>
                  <h3 class="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-3">Staff</h3>
                  <p class="text-text-secondary-light dark:text-text-secondary-dark mb-6">
                    Point-of-sale operations for processing customer transactions.
                  </p>
                  <ul class="space-y-2 mb-8 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    <li class="flex items-center gap-2">
                      <span class="material-symbols-outlined text-success text-lg">check_circle</span>
                      Process sales
                    </li>
                    <li class="flex items-center gap-2">
                      <span class="material-symbols-outlined text-success text-lg">check_circle</span>
                      Handle payments
                    </li>
                    <li class="flex items-center gap-2">
                      <span class="material-symbols-outlined text-success text-lg">check_circle</span>
                      Print receipts
                    </li>
                    <li class="flex items-center gap-2">
                      <span class="material-symbols-outlined text-success text-lg">check_circle</span>
                      View order history
                    </li>
                  </ul>
                  <button 
                    data-route="login" 
                    data-route-params='{"role":"staff"}'
                    class="w-full mt-auto flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white font-bold rounded-xl hover:bg-amber-500 transition-colors">
                    <span>Staff Login</span>
                    <span class="material-symbols-outlined">arrow_forward</span>
                  </button>
                </div>
              </div>
              
              <!-- Purchasing Agent -->
              <div class="group relative bg-surface-light dark:bg-surface-dark rounded-2xl border-2 border-border-light dark:border-border-dark hover:border-secondary p-8 transition-all hover:shadow-2xl hover:-translate-y-1 h-full flex flex-col">
                <div class="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-bl-full"></div>
                <div class="relative flex flex-col flex-1">
                  <div class="w-16 h-16 bg-gradient-to-br from-secondary to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <span class="material-symbols-outlined text-3xl text-white">local_shipping</span>
                  </div>
                  <h3 class="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-3">Purchasing Agent</h3>
                  <p class="text-text-secondary-light dark:text-text-secondary-dark mb-6">
                    Manage suppliers and create purchase orders for restocking.
                  </p>
                  <ul class="space-y-2 mb-8 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    <li class="flex items-center gap-2">
                      <span class="material-symbols-outlined text-success text-lg">check_circle</span>
                      Manage suppliers
                    </li>
                    <li class="flex items-center gap-2">
                      <span class="material-symbols-outlined text-success text-lg">check_circle</span>
                      Create reorders
                    </li>
                    <li class="flex items-center gap-2">
                      <span class="material-symbols-outlined text-success text-lg">check_circle</span>
                      Track stock levels
                    </li>
                    <li class="flex items-center gap-2">
                      <span class="material-symbols-outlined text-success text-lg">check_circle</span>
                      View low-stock alerts
                    </li>
                  </ul>
                  <button 
                    data-route="login" 
                    data-route-params='{"role":"purchasing"}'
                    class="w-full mt-auto flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-white font-bold rounded-xl hover:bg-green-600 transition-colors">
                    <span>Purchasing Login</span>
                    <span class="material-symbols-outlined">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Features Overview -->
        <section class="py-16 lg:py-24 bg-surface-light dark:bg-surface-dark">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
              <h2 class="text-3xl lg:text-4xl font-black text-text-primary-light dark:text-text-primary-dark mb-4">
                System Features
              </h2>
            </div>
            
            <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div class="p-6 bg-background-light dark:bg-background-dark rounded-xl">
                <span class="material-symbols-outlined text-3xl text-primary mb-4 block">inventory_2</span>
                <h4 class="font-bold text-text-primary-light dark:text-text-primary-dark mb-2">Stock Management</h4>
                <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">Real-time inventory tracking with low-stock alerts</p>
              </div>
              <div class="p-6 bg-background-light dark:bg-background-dark rounded-xl">
                <span class="material-symbols-outlined text-3xl text-accent mb-4 block">point_of_sale</span>
                <h4 class="font-bold text-text-primary-light dark:text-text-primary-dark mb-2">Point of Sale</h4>
                <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">Fast checkout with automatic stock updates</p>
              </div>
              <div class="p-6 bg-background-light dark:bg-background-dark rounded-xl">
                <span class="material-symbols-outlined text-3xl text-secondary mb-4 block">domain</span>
                <h4 class="font-bold text-text-primary-light dark:text-text-primary-dark mb-2">Supplier Tracking</h4>
                <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">Manage vendors and automate reorder lists</p>
              </div>
              <div class="p-6 bg-background-light dark:bg-background-dark rounded-xl">
                <span class="material-symbols-outlined text-3xl text-purple-500 mb-4 block">bar_chart</span>
                <h4 class="font-bold text-text-primary-light dark:text-text-primary-dark mb-2">Reports</h4>
                <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">Daily/monthly sales and stock summaries</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Footer -->
        <footer class="bg-text-primary-light dark:bg-text-primary-dark py-8">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col md:flex-row items-center justify-between gap-4">
              <div class="flex items-center gap-3">
                <div class="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg">
                  <span class="text-white text-sm">🛒</span>
                </div>
                <span class="font-bold text-white">Grocery MS</span>
              </div>
              <p class="text-neutral/70 text-sm">
                © 2025 Grocery Management System - Made by Saad Ali
              </p>
              <p class="text-neutral/50 text-xs">
                University of Mianwali - Database Project
              </p>
            </div>
          </div>
        </footer>
      </div>
    `,

    onMount({ navigate }) {
      // All buttons with data-route will be handled by the global click handler
    },
  };
}
