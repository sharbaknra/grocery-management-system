# Backend Surface Snapshot

Front-end modules should treat the backend as an Express + MySQL API exposed from `server.js` with JWT auth, role-aware routing middleware, and RESTful resources organized by domain. This document maps the available capabilities so pages can stay aligned with real endpoints and data contracts.

## Runtime, Auth, and Roles

- **Base URL:** `http://localhost:3000/api` (see `README.md`). Static uploads (product images) come from `/uploads/<filename>`.
- **Middleware stack:** `cors`, `express.json`, static `/uploads`, plus centralized error handler (`server.js`).
- **Authentication:** `/api/users/login` returns a JWT token (`userController.login`). Include `Authorization: Bearer <token>` on every protected request.
- **Roles:** `admin`, `staff`, `customer`. `middleware/adminMiddleware.js` restricts admin-only actions; `middleware/roleMiddleware.js` (`allowRoles(...)`) gates fine-grained access; `middleware/authMiddleware.js` (`verifyToken`) must wrap every protected route.

## Default Accounts & Expectations

- Admin: `admin@grocery.com / admin123`
- Staff: `staff@grocery.com / staff123`
- Cart/checkout flows expect a `customer` role but admins/staff may impersonate for QA (`allowRoles("customer","admin","staff")` on cart/order routes).

## Domain Catalog

Each subsection lists the governing files, endpoints, allowed roles, and notable payloads/fields derived from models and controllers.

### 1. Users & Sessions

- **Files:** `controllers/userController.js`, `routes/userRoutes.js`, `models/userModel.js`, `utils/tokenBlacklist.js`.
- **Endpoints:**
  - `POST /api/users/register` → public signup (name, email, password). Validates uniqueness, hashes password.
  - `POST /api/users/login` → returns `{ token, user: { id, name, email, role } }`.
  - `GET /api/users/` → admin-only directory.
- **Data Fields:** `users` table stores `name`, `email`, `password`, `role`, timestamps.
- **Frontend Notes:** Store JWT + role in `state/appState`. Provide logout hook that blacklists token via `/api/users/logout` if implemented (check `userController.logout` once wired).

### 2. Products & Inventory

- **Files:** `controllers/productController.js`, `models/productModel.js`, `models/stockModel.js`, `routes/productRoutes.js`, `routes/stockRoutes.js`.
- **Product Endpoints:**
  - `POST /api/products/add` *(admin only, multipart form)*: accepts `name`, `category`, `price`, `barcode`, `description`, `expiry_date`, `supplierId`, optional `image`.
  - `GET /api/products` (auth): supports query parameters `name`, `category`, `minPrice`, `maxPrice`.
  - `GET /api/products/search?name=` (auth), `GET /api/products/:id`.
  - `PUT /api/products/update/:id` *(admin only, multipart)*.
  - `DELETE /api/products/delete/:id` *(admin only)*.
- **Stock Endpoints:**
  - `POST /api/stock/restock` *(admin)* → `{ productId, quantity, reason? }`.
  - `POST /api/stock/reduce` *(admin/staff)* → same payload, enforces non-negative stock.
  - `GET /api/stock/low-stock` *(admin/staff)* → items where `quantity <= min_stock_level`.
  - `GET /api/stock/movements` *(admin/staff)* → audit log (join with users for `user_name`).
- **Data Shape:** `Product.getAll()` joins `stock` and `suppliers`, exposing `quantity`, `min_stock_level`, `supplier_*` fields, `image_url`, `barcode`, `expiry_date`. Handle `null` supplier gracefully.
- **Frontend Notes:** Image URLs resolve to `/uploads/<image_url>`. Maintain optimistic updates for stock operations and reflect `Stock.logMovement` outputs when building movement timeline components.

### 3. Suppliers & Purchasing (Module 2.8.4)

- **Files:** `controllers/supplierController.js`, `models/supplierModel.js`, `routes/supplierRoutes.js`.
- **Endpoints:**
  - `POST /api/suppliers` *(admin)* → create supplier (`name`, `contact_name`, `phone`, `email`, `address`, `lead_time_days`, `min_order_amount`, `notes`).
  - `GET /api/suppliers` *(admin/staff)* → list with aggregated stats (linked products, low-stock counts).
  - `GET /api/suppliers/:id` *(admin/staff)* → supplier profile incl. products/order history.
  - `PUT /api/suppliers/:id`, `DELETE /api/suppliers/:id` *(admin)*.
  - `GET /api/suppliers/reorder` *(admin/staff)* → dashboard grouping shortages per supplier (uses `Supplier.getReorderList()`).
  - `GET /api/suppliers/:id/reorder` *(admin/staff)* → supplier-specific reorder sheet.
- **Frontend Notes:** Reorder views should surface `shortage` and `suggested_order_quantity` fields and support CSV/PDF export via reports endpoints.

### 4. Cart & Checkout (POS)

- **Files:** `controllers/cartController.js`, `controllers/checkoutController.js`, `routes/cartRoutes.js`, `routes/orderRoutes.js`, `models/cartModel.js`, `models/orderModel.js`, `models/orderItemModel.js`.
- **Cart Endpoints** (`/api/orders/cart` base, roles customer/admin/staff):
  - `POST /add` → `{ productId, quantity }`.
  - `GET /` → returns cart lines (product metadata joined).
  - `PUT /update` → adjust quantity.
  - `DELETE /remove/:productId`, `DELETE /clear`.
- **Checkout Endpoint:**
  - `POST /api/orders/checkout` → charges cart, creates order + payment summary, atomically reduces stock (`checkoutController.checkout` orchestrates).
- **Frontend Notes:** Keep cart state in local store but re-fetch after each mutation for authoritative totals. Handle validation errors (out-of-stock, price changes) surfaced via 400/409 responses.

### 5. Orders & History

- **Files:** `controllers/orderHistoryController.js`, `routes/orderRoutes.js`, `models/orderModel.js`, `models/orderItemModel.js`.
- **Endpoints:**
  - `GET /api/orders` *(admin/staff)* → paginated? (returns array sorted by date; check controller for filters).
  - `GET /api/orders/me` *(customer/admin/staff)* → personal order history.
  - `GET /api/orders/:orderId` *(customer/admin/staff with ownership checks)*.
- **Data Fields:** Each order includes `id`, `user_id`, `status`, `total_amount`, timestamps, and nested `items` with `product_id`, `unit_price_at_sale`.
- **Frontend Notes:** Provide filters by date/status (if controller supports query params) and show payment + fulfillment metadata surfaced by controller responses.

### 6. Reports & Analytics

- **Files:** `controllers/reportsController.js`, `routes/reportsRoutes.js`, `utils/exportUtils.js`.
- **Access:** Admin + Staff only.
- **Sales Reports:** `/sales/summary`, `/sales/daily?days=7`, `/sales/weekly`, `/sales/monthly?months=6`.
- **Inventory Reports:** `/inventory/low-stock`, `/inventory/out-of-stock`, `/inventory/expiring?days=60`, `/inventory/valuation`.
- **Product Performance:** `/products/top-selling?limit=10`, `/products/dead`, `/products/category-sales`.
- **Exports:** `/export/csv?type=<report-key>`, `/export/pdf?type=<report-key>`.
- **Frontend Notes:** Build report filters that mirror query params (`days`, `months`, `limit`). Export endpoints respond with binary streams; trigger downloads via `fetch` + Blob or linking with `window.open`.

### 7. Miscellaneous / Supporting Modules

- **Items Catalog (`routes/itemRoutes.js`):** Legacy/simple product list accessible publicly (`GET /api/items`). Admins can `POST/PUT/DELETE` for quick seed data; may power kiosk or offline sync features.
- **Uploads:** `middleware/uploadMiddleware.js` enforces 3MB limit and file storage path. Frontend should show progress for image uploads and handle `MulterError` messages defined in `server.js`.
- **Logging & Error Patterns:** All controllers `console.error` server-side and return JSON `{ message, error? }`. The frontend should surface `message` plus any `validationErrors` if present.

## Data Relationships Snapshot

- **Products ↔ Stock:** 1:1 via `stock.product_id`. Stock holds `quantity`, `min_stock_level`, `last_restock_date`.
- **Products ↔ Suppliers:** Optional `products.supplier_id`. Supplier records include contact + SLA data.
- **Orders ↔ Order Items:** `order_items` track `product_id`, `quantity`, `unit_price_at_sale`.
- **Stock Movements:** Audit entries referencing `product_id` and `user_id`.
- **Cart:** Stores pending selections keyed by `user_id`, enabling persistent carts per authenticated user.

## Frontend Coverage Matrix (What Needs a Page/Component)

| Domain | Key Views | Required API Hooks |
| --- | --- | --- |
| Auth & Session | Login, Register, Logout, User list (admin) | `/api/users/*` |
| Dashboard | KPI cards, alerts | `/api/reports/sales/summary`, `/inventory/low-stock` |
| Products | List, detail, create/edit, image upload | `/api/products/*`, `/api/stock/*` |
| Stock Ops | Restock/reduce modals, movement history | `/api/stock/restock`, `/reduce`, `/movements` |
| Suppliers | Directory, detail, reorder dashboard | `/api/suppliers*` |
| Cart & Checkout | Cart drawer/page, checkout form | `/api/orders/cart/*`, `/api/orders/checkout` |
| Orders | Staff order board, customer history, order detail | `/api/orders*` |
| Reports | Sales/inventory/product analytics, exports | `/api/reports/*` |
| Items (Legacy) | Simple catalog admin | `/api/items` |

Use this sheet as the single source of truth while wiring `frontend/src/pages/**` and services so every backend feature earns UI coverage.

