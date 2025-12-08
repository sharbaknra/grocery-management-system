## UI Elements Catalog – Grocery Management System

This catalog lists the main UI elements used across the SPA frontend and where they appear. Use it as a reference when designing tests and UI changes.

### 1. Buttons

- **Primary buttons**
  - Pages:
    - `home` – role login CTA (`Manager Login`, `Staff Login`, `Purchasing Login`)
    - `products` – `Add New Product`
    - `product-detail` – `Edit Product`, `Delete`
    - `stock` – `Add New Product` (non-purchasing roles)
    - `cart` – `Proceed to Checkout`
    - `checkout` – `Confirm Order`
    - `reports` – `Generate`
  - Behavior notes:
    - Trigger navigation (`data-route`), form submissions or async operations.
    - Show loading/disabled states for long-running actions (e.g., add to cart, checkout).

- **Secondary / neutral buttons**
  - Pages:
    - `home` – `Log In`
    - `products` – filter/search controls (in form)
    - `cart` – `Continue Shopping`, `Empty Cart`
    - `checkout` – `Cancel` (back to `cart`)
    - `reports` – report type selector tiles, export buttons (`CSV`, `PDF`)
  - Behavior notes:
    - Often rely on `data-route` (navigation) or `data-*` attributes (filtering, modals).

- **Icon-only or icon-leading buttons**
  - Pages/components:
    - `products` – `View`, `Edit`, `Add to Cart` actions on each product card (material icons).
    - `cart` – quantity `+` / `-` controls, delete icon.
    - `checkout` – `Print Receipt`, `New Sale`.
  - Behavior notes:
    - Identified by `data-view-product`, `data-edit-product`, `data-add-to-cart`, `data-remove`, etc.

### 2. Inputs & Form Controls

- **Text inputs**
  - `products` – search field (`name="search"`).
  - `stock` – search field (`data-search-input`).
  - `checkout` – customer name/phone.
  - Various forms (not fully listed here) – product and supplier forms.

- **Number inputs**
  - `cart` – quantity input per cart row (`data-quantity-input`).
  - `stock` – modal quantity field (`id="modal-quantity"`).

- **Date inputs**
  - `reports` – `From`/`To` date filters (`data-start-date`, `data-end-date`).

- **Radio buttons**
  - `checkout` – payment method selection (`name="payment_method"`).
  - `stock` – adjustment type in update modal (`name="adjustment_type"`).

- **Selects / dropdowns**
  - `products` – category filter (`name="category"`), sort select (`name="sort"`).
  - `stock` – status filter (`data-filter-status`).
  - Other forms – supplier/product selects (defined in page/form modules).

### 3. Navigation Elements

- **Global navigation**
  - `home` – top navigation bar with `Log In` and role cards using `data-route` + `data-route-params`.
  - Router registration:
    - `frontend/src/pages/index.js` registers routes like `home`, `products`, `product-detail`, `stock`, `cart`, `checkout`, `suppliers`, `orders`, `reports`, `billing`, `settings`, `staff-*`.

- **In-page navigation**
  - Breadcrumbs:
    - `product-detail` – breadcrumb buttons and labels (`data-breadcrumb-category`, `data-breadcrumb-name`).
  - Route buttons:
    - `cart` – `data-route="products"`.
    - `checkout` – `data-route="cart"`.
    - `product-detail` – `data-route="products"`, `data-route="stock"`, navigate to supplier via `data-view-supplier`.

### 4. Tables & Lists

- **Cart table**
  - File: `frontend/src/pages/cart/cartPage.js`
  - Elements:
    - Table body: `[data-cart-items]` – cart rows.
    - Columns: product info, quantity controls, price, line total, remove button.

- **Stock levels table**
  - File: `frontend/src/pages/stock/levelsPage.js`
  - Elements:
    - Table body: `[data-stock-table]` – rows with name, quantity, min level, status badge, last restock, action button.
    - Status badge uses `getStockStatus` (OK / Low Stock / Out of Stock).

- **Reports tables**
  - File: `frontend/src/pages/reports/reportsPage.js`
  - Elements:
    - Inventory report table – inventory status, including low-stock/out-of-stock badges.
    - Top products and expiring products tables.

- **Product cards grid**
  - File: `frontend/src/pages/products/listPage.js`
  - Elements:
    - Container: `[data-products-grid]`.
    - Each card includes image, name, category chip, price, stock quantity, and stock status badge.

### 5. Badges & Status Indicators

- **Stock status badges**
  - Places:
    - Product list cards (`products`) – `In Stock` / `Low Stock` / `Out of Stock`.
    - Product detail stock card – status span (`[data-stock-status]`).
    - Stock levels table – status column badges.
    - Inventory report (`reports`) – status badges per item.
  - Logic:
    - Implemented via `getStockStatus(quantity, minLevel)` helpers in `products` list, product detail, and stock levels pages.

- **Low stock indicators**
  - Appear wherever `quantity` is below `min_stock_level` or a hardcoded threshold (e.g., `< 10` in product list).
  - Expected visuals:
    - Label: `"Low Stock"`.
    - Styling: warning color chip (e.g., `bg-warning/10 text-warning` + dot).

- **Out-of-stock indicators**
  - Label: `"Out of Stock"`.
  - Styling: danger color chip.
  - Affects:
    - Product card badges.
    - Stock levels table.
    - Inventory report.

### 6. Modals & Overlays

- **Stock update modal**
  - File: `frontend/src/pages/stock/levelsPage.js`
  - Elements:
    - Container: `[data-update-modal]`.
    - Product name: `[data-modal-product-name]`.
    - Form: `[data-update-form]` (hidden product id, adjustment type, quantity, reason).
    - Status message: `[data-modal-status]`.
    - Close button: `[data-close-modal]`.

- **Checkout success modal**
  - File: `frontend/src/pages/checkout/checkoutPage.js`
  - Elements:
    - Container: `[data-success-modal]`.
    - Order id label: `[data-order-id]`.
    - Actions: `[data-print-receipt]`, `[data-new-sale]`.

### 7. Forms & Validation Surfaces

- **Product list search/filter form**
  - File: `frontend/src/pages/products/listPage.js`
  - Elements:
    - `<form data-search-form>` with `search`, `category`, `sort`.
  - Behavior:
    - Debounced submissions on input/selection change, calls `productsService.list`.

- **Stock update form (modal)**
  - File: `frontend/src/pages/stock/levelsPage.js`
  - Elements:
    - Fields: `product_id` (hidden), `adjustment_type` radio, `quantity` (required, min=1), `reason` (optional).
  - Behavior:
    - Submits to `stockService.restock` / `stockService.reduce`, then reloads table.

- **Checkout form (implicit)**
  - File: `frontend/src/pages/checkout/checkoutPage.js`
  - Elements:
    - Payment method radios, customer info fields.
    - Confirm button `[data-confirm-order]` triggers `ordersService.checkout`.

### 8. Loading, Empty, and Error States

- **Loading**
  - Common pattern: spinner + message blocks with `data-loading` or equivalent.
  - Pages:
    - `cart` – `[data-loading]`.
    - `checkout` – `[data-loading]`.
    - `product-detail` – `[data-loading]`.
    - `stock` – loading row in `[data-stock-table]`.
    - `reports` – `[data-report-loading]`.

- **Empty states**
  - `cart` – `[data-empty-cart]` block when no items.
  - `products` – no-products message in grid.
  - `stock` – no-products message in stock table.
  - `reports` – “No low stock items” / “No sales data” messages.

- **Error states**
  - `product-detail` – error block `[data-error]` with `[data-error-message]`.
  - `products` – error section with retry button (`[data-retry]`).
  - `stock` – table-level error row.
  - `reports` – error message injected into `[data-report-output]`.

### 9. Pages Where Stock Information Appears

Use this as a quick index for interconnectivity tests around low stock:

- `products` (list)
  - Shows stock quantity and status badge per product card.
- `product-detail`
  - Shows stock quantity, min stock level, status badge, last restock.
- `stock` (stock levels)
  - Shows stock quantity, min stock, status badge, last restock, and update actions.
- `reports` (inventory report)
  - Shows inventory status table with stock quantities and status badges.
- `cart` / `checkout`
  - Do not display explicit “Low Stock” badges, but interact with stock indirectly via cart and checkout validation logic (covered in flow tests).


