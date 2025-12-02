import { getState, subscribe } from "./state/appState.js";
import { authService } from "./services/authService.js";

// ============================================================================
// CONFIGURATION
// ============================================================================
const LAST_ROUTE_KEY = "gms:lastRoute";
const PUBLIC_ROUTES = new Set(["home", "login", "register"]);

// Role-based route permissions
const ROLE_ROUTES = {
  admin: ["manager-dashboard", "products", "product-detail", "product-form", "stock", "suppliers", "supplier-detail", "supplier-form", "reorder-dashboard", "orders", "order-detail", "reports", "billing", "invoice-detail", "settings"],
  manager: ["manager-dashboard", "products", "product-detail", "product-form", "stock", "suppliers", "supplier-detail", "supplier-form", "reorder-dashboard", "orders", "order-detail", "reports", "billing", "invoice-detail", "settings"],
  staff: ["pos", "orders", "order-detail", "billing", "invoice-detail"],
  purchasing: ["purchasing-dashboard", "suppliers", "supplier-detail", "reorder-dashboard", "stock"],
};

// Default dashboard per role
const ROLE_DASHBOARDS = {
  admin: "manager-dashboard",
  manager: "manager-dashboard",
  staff: "pos",
  purchasing: "purchasing-dashboard",
};

// ============================================================================
// STATE
// ============================================================================
const routes = new Map();
let appRoot = null;
let currentCleanup = null;
let currentRoute = null;

// ============================================================================
// ROLE HELPERS
// ============================================================================
function getUserRole() {
  const state = getState();
  return state.user?.role || "staff";
}

function getDefaultDashboard() {
  const role = getUserRole();
  return ROLE_DASHBOARDS[role] || "pos";
}

function canAccessRoute(route) {
  const role = getUserRole();
  const allowedRoutes = ROLE_ROUTES[role] || ROLE_ROUTES.staff;
  return allowedRoutes.includes(route);
}

function getRoleName(role) {
  const names = {
    admin: "Store Manager",
    manager: "Store Manager",
    staff: "Staff",
    purchasing: "Purchasing Agent",
  };
  return names[role] || "Staff";
}

// ============================================================================
// ROUTING
// ============================================================================
function registerPage(id, factory) {
  routes.set(id, factory);
}

function navigate(page) {
  const hasSession = Boolean(getState().token);
  const isPublic = PUBLIC_ROUTES.has(page);

  // Redirect to login if not authenticated and trying to access protected route
  if (!hasSession && !isPublic) {
    persistLastRoute(page);
    currentRoute = "login";
    renderPage();
    return;
  }

  // Redirect to role-specific dashboard if authenticated and trying to access login/home
  if (hasSession && (page === "login" || page === "home")) {
    currentRoute = getDefaultDashboard();
    persistLastRoute(currentRoute);
    renderPage();
    return;
  }

  // Check role-based access
  if (hasSession && !isPublic && !canAccessRoute(page)) {
    console.warn(`Access denied to route: ${page}`);
    currentRoute = getDefaultDashboard();
    persistLastRoute(currentRoute);
    renderPage();
    return;
  }

  currentRoute = page;
  persistLastRoute(page);
  renderPage();
}

function resolveInitialRoute() {
  const state = getState();
  const stored = getLastRoute();
  if (state.token) {
    // Check if stored route is accessible
    if (stored && !PUBLIC_ROUTES.has(stored) && canAccessRoute(stored)) {
      return stored;
    }
    return getDefaultDashboard();
  }
  return "home";
}

function getLastRoute() {
  try {
    return localStorage.getItem(LAST_ROUTE_KEY);
  } catch {
    return null;
  }
}

function persistLastRoute(route) {
  try {
    localStorage.setItem(LAST_ROUTE_KEY, route);
  } catch {
    // ignore
  }
}

// ============================================================================
// RENDERING
// ============================================================================
function renderPage() {
  if (!appRoot) return;

  // Cleanup previous page
  if (typeof currentCleanup === "function") {
    currentCleanup();
    currentCleanup = null;
  }

  const state = getState();
  const isPublic = PUBLIC_ROUTES.has(currentRoute);

  // Render full-page layout for public routes (login, register, home)
  if (isPublic) {
    renderPublicPage();
  } else {
    renderAuthenticatedPage(state);
  }
}

function renderPublicPage() {
  const factory = routes.get(currentRoute);
  if (!factory) {
    appRoot.innerHTML = renderNotFound();
    return;
  }

  const result = factory({ route: currentRoute, state: getState() });
  const html = typeof result === "string" ? result : result?.html ?? "";
  appRoot.innerHTML = html;

  if (result && typeof result.onMount === "function") {
    const maybeCleanup = result.onMount({
      state: getState(),
      navigate,
      root: appRoot,
      route: currentRoute,
      getState,
      subscribe,
    });
    if (typeof maybeCleanup === "function") {
      currentCleanup = maybeCleanup;
    }
  }
}

function renderAuthenticatedPage(state) {
  const role = getUserRole();
  
  // Render app shell with role-specific sidebar
  appRoot.innerHTML = renderAppShell(state, role);

  // Render page content into outlet
  const outlet = appRoot.querySelector("[data-page-outlet]");
  if (!outlet) return;

  const factory = routes.get(currentRoute);
  if (!factory) {
    outlet.innerHTML = renderNotFound();
    return;
  }

  const result = factory({ route: currentRoute, state });
  const html = typeof result === "string" ? result : result?.html ?? "";
  outlet.innerHTML = html;

  // Update active nav state
  updateNavState();

  if (result && typeof result.onMount === "function") {
    const maybeCleanup = result.onMount({
      state: getState(),
      navigate,
      root: appRoot,
      route: currentRoute,
      getState,
      subscribe,
    });
    if (typeof maybeCleanup === "function") {
      currentCleanup = maybeCleanup;
    }
  }
}

function renderAppShell(state, role) {
  const user = state.user || {};
  const initials = computeInitials(user.name);
  const roleName = getRoleName(role);
  
  // Get role-specific navigation
  const navItems = getNavItemsForRole(role);

  return `
    <div class="relative flex min-h-screen w-full">
      <!-- Sidebar -->
      <aside class="flex h-screen w-64 flex-col bg-surface-light dark:bg-surface-dark border-r border-border-light dark:border-border-dark sticky top-0">
        <div class="flex flex-col justify-between flex-1 p-4">
          <!-- Logo & Nav -->
          <div class="flex flex-col gap-4">
            <div class="flex items-center gap-3 px-2 py-2">
              <div class="flex items-center justify-center w-10 h-10 bg-primary/20 rounded-lg">
                <span class="material-symbols-outlined text-primary">storefront</span>
              </div>
              <div class="flex flex-col">
                <h1 class="text-text-primary-light dark:text-text-primary-dark text-base font-bold leading-tight">Grocery MS</h1>
                <p class="text-text-secondary-light dark:text-text-secondary-dark text-xs font-normal">${roleName}</p>
              </div>
            </div>
            
            <nav class="flex flex-col gap-1 mt-2">
              ${navItems}
            </nav>
          </div>
          
          <!-- Bottom Nav -->
          <div class="flex flex-col gap-1 border-t border-border-light dark:border-border-dark pt-4">
            <button data-route="settings" class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary-light dark:text-text-secondary-dark hover:bg-primary/10 hover:text-primary transition-colors">
              <span class="material-symbols-outlined text-xl">settings</span>
              <span class="text-sm font-medium">Settings</span>
            </button>
            <button data-action="logout" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary-light dark:text-text-secondary-dark hover:bg-danger/10 hover:text-danger transition-colors">
              <span class="material-symbols-outlined text-xl">logout</span>
              <span class="text-sm font-medium">Log Out</span>
            </button>
          </div>
        </div>
      </aside>
      
      <!-- Main Content -->
      <div class="flex-1 flex flex-col min-h-screen">
        <!-- Top Bar -->
        <header class="sticky top-0 z-10 flex items-center justify-between px-6 lg:px-8 py-4 bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-sm border-b border-border-light dark:border-border-dark">
          <div class="flex items-center gap-4">
            <h2 data-page-title class="text-xl font-bold text-text-primary-light dark:text-text-primary-dark capitalize">${formatTitle(currentRoute)}</h2>
          </div>
          <div class="flex items-center gap-3">
            <div class="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full">
              <span class="w-2 h-2 bg-primary rounded-full"></span>
              <span class="text-xs font-medium text-primary">${roleName}</span>
            </div>
            <button class="flex items-center justify-center w-10 h-10 rounded-lg bg-background-light dark:bg-background-dark hover:bg-primary/10 transition-colors">
              <span class="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark">notifications</span>
            </button>
            <div class="flex items-center gap-3 pl-3 border-l border-border-light dark:border-border-dark">
              <div class="flex flex-col items-end">
                <span class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">${user.name || "User"}</span>
              </div>
              <div class="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-bold text-sm">
                ${initials}
              </div>
            </div>
          </div>
        </header>
        
        <!-- Page Content -->
        <main class="flex-1 p-6 lg:p-8" data-page-outlet></main>
      </div>
    </div>
  `;
}

function getNavItemsForRole(role) {
  const navConfigs = {
    admin: [
      { route: "manager-dashboard", icon: "dashboard", label: "Dashboard" },
      { route: "products", icon: "inventory_2", label: "Products" },
      { route: "stock", icon: "monitoring", label: "Stock Levels" },
      { route: "suppliers", icon: "domain", label: "Suppliers" },
      { route: "orders", icon: "receipt_long", label: "Orders" },
      { route: "billing", icon: "request_quote", label: "Billing" },
      { route: "reports", icon: "bar_chart", label: "Reports" },
    ],
    manager: [
      { route: "manager-dashboard", icon: "dashboard", label: "Dashboard" },
      { route: "products", icon: "inventory_2", label: "Products" },
      { route: "stock", icon: "monitoring", label: "Stock Levels" },
      { route: "suppliers", icon: "domain", label: "Suppliers" },
      { route: "orders", icon: "receipt_long", label: "Orders" },
      { route: "billing", icon: "request_quote", label: "Billing" },
      { route: "reports", icon: "bar_chart", label: "Reports" },
    ],
    staff: [
      { route: "pos", icon: "point_of_sale", label: "Point of Sale" },
      { route: "orders", icon: "receipt_long", label: "Orders" },
      { route: "billing", icon: "request_quote", label: "Billing" },
    ],
    purchasing: [
      { route: "purchasing-dashboard", icon: "dashboard", label: "Dashboard" },
      { route: "suppliers", icon: "domain", label: "Suppliers" },
      { route: "reorder-dashboard", icon: "shopping_cart", label: "Reorder" },
      { route: "stock", icon: "monitoring", label: "Stock Levels" },
    ],
  };

  const items = navConfigs[role] || navConfigs.staff;
  
  return items.map(item => `
    <button data-route="${item.route}" class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary-light dark:text-text-secondary-dark hover:bg-primary/10 hover:text-primary transition-colors">
      <span class="material-symbols-outlined text-xl">${item.icon}</span>
      <span class="text-sm font-medium">${item.label}</span>
    </button>
  `).join("");
}

function renderNotFound() {
  return `
    <div class="flex flex-col items-center justify-center min-h-[400px] text-center">
      <span class="material-symbols-outlined text-6xl text-text-secondary-light dark:text-text-secondary-dark mb-4">search_off</span>
      <h2 class="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">Page Not Found</h2>
      <p class="text-text-secondary-light dark:text-text-secondary-dark mb-6">The page you're looking for doesn't exist.</p>
      <button data-route="${getDefaultDashboard()}" class="px-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover transition-colors">
        Go to Dashboard
      </button>
    </div>
  `;
}

function updateNavState() {
  const navItems = appRoot?.querySelectorAll(".nav-item[data-route]");
  navItems?.forEach((item) => {
    const route = item.dataset.route;
    const isActive = route === currentRoute;
    item.classList.toggle("bg-primary/10", isActive);
    item.classList.toggle("text-primary", isActive);
    item.classList.toggle("text-text-secondary-light", !isActive);
    item.classList.toggle("dark:text-text-secondary-dark", !isActive);
    
    // Update icon fill
    const icon = item.querySelector(".material-symbols-outlined");
    if (icon) {
      icon.classList.toggle("fill", isActive);
    }
  });

  // Update page title
  const titleEl = appRoot?.querySelector("[data-page-title]");
  if (titleEl) {
    titleEl.textContent = formatTitle(currentRoute);
  }
}

function formatTitle(route) {
  if (!route) return "Dashboard";
  const titles = {
    "manager-dashboard": "Dashboard",
    "pos": "Point of Sale",
    "purchasing-dashboard": "Purchasing Dashboard",
    "reorder-dashboard": "Reorder Dashboard",
  };
  return titles[route] || route
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
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

// ============================================================================
// EVENT HANDLING
// ============================================================================
function attachGlobalListeners() {
  appRoot?.addEventListener("click", (event) => {
    const target = event.target.closest("[data-route], [data-action]");
    if (!target) return;

    const action = target.dataset.action;
    if (action === "logout") {
      event.preventDefault();
      handleLogout();
      return;
    }

    const route = target.dataset.route;
    if (route) {
      event.preventDefault();
      navigate(route);
    }
  });
}

async function handleLogout() {
  try {
    await authService.logout();
  } catch (error) {
    console.warn("Logout error:", error);
  } finally {
    persistLastRoute("home");
    currentRoute = "home";
    renderPage();
  }
}

// ============================================================================
// CART STATE SYNC (for POS)
// ============================================================================
function syncCartBadge(state) {
  const badge = appRoot?.querySelector("[data-cart-count]");
  if (!badge) return;
  
  const count = state.cart?.items?.length || 0;
  badge.textContent = count;
  badge.classList.toggle("hidden", count === 0);
}

// ============================================================================
// PAGE REGISTRATION
// ============================================================================
import { registerPages } from "./pages/index.js";
registerPages(registerPage);

// ============================================================================
// BOOTSTRAP
// ============================================================================
function bootstrap() {
  appRoot = document.querySelector("[data-app-root]");
  if (!appRoot) {
    throw new Error("Missing app root element");
  }

  currentRoute = resolveInitialRoute();
  attachGlobalListeners();
  renderPage();

  // Subscribe to state changes
  subscribe((state) => {
    syncCartBadge(state);
  });

  // Expose for debugging
  window.gmsRouter = { navigate, getState, subscribe, getUserRole };
}

bootstrap();
