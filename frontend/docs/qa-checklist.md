# Frontend QA Checklist

Use this guide to verify that every UI surface is wired to the correct Express endpoint, enforces role rules, and renders the expected data. Run through the scenarios after wiring the services layer.

## Legend

- **Roles:** `A` = Admin, `S` = Staff, `C` = Customer.
- **Auth:** ✓ requires JWT, ✗ public.

## Auth & Session

| Page / Route | Endpoint(s) | Roles | Auth | Test Scenarios |
| --- | --- | --- | --- | --- |
| Login (`/api/users/login`) | `POST /api/users/login` | Public | ✗ | Valid credentials (admin/staff), invalid creds (wrong password), locked account when token revoked |
| Register (`/api/users/register`) | `POST /api/users/register` | Public (approval flow) | ✗ | Create staff account, prevent duplicate email, enforce password length |
| User Directory (`/api/users`) | `GET /api/users` | A | ✓ | List all users, verify non-admin blocked |
| Logout | `POST /api/users/logout` (best effort) | A/S/C | ✓ | Token invalidation, fallback to local clear |

## Dashboard & Reports

| Page | Endpoint(s) | Roles | Auth | Scenarios |
| --- | --- | --- | --- | --- |
| Dashboard overview | `GET /api/reports/sales/summary`, `/api/stock/low-stock`, `/api/orders?limit=5` | A/S | ✓ | KPI values load, low-stock table paginates, link to orders detail |
| Reports hub | `/api/reports/sales/*`, `/api/reports/inventory/*`, `/api/reports/products/*`, `/api/reports/export/{csv,pdf}` | A/S | ✓ | Filter by date range, export CSV/PDF, handle empty responses |

## Products & Inventory

| Page | Endpoint(s) | Roles | Auth | Scenarios |
| --- | --- | --- | --- | --- |
| Product list | `GET /api/products`, `/api/products/search`, query params (`category`, `minPrice`, `maxPrice`) | A/S/C | ✓ | Filter by name, price range, unauthorized user redirected |
| Product detail | `GET /api/products/:id` | A/S/C | ✓ | Load supplier info, handle 404 |
| Product form | `POST /api/products/add`, `PUT /api/products/update/:id`, `DELETE /api/products/delete/:id`, `/api/suppliers` for select options | A | ✓ | Create with image upload (Multer limit), update, delete with confirmation |
| Stock tools | `POST /api/stock/restock`, `/api/stock/reduce`, `GET /api/stock/low-stock`, `/api/stock/movements` | A (restock) / S (reduce/read) | ✓ | Validation on negative quantities, audit log fetch |

## Suppliers & Purchasing

| Page | Endpoint(s) | Roles | Auth | Scenarios |
| --- | --- | --- | --- | --- |
| Supplier list | `GET /api/suppliers` | A/S | ✓ | Filter by name/lead time, navigation to detail |
| Supplier detail | `GET /api/suppliers/:id`, `PUT /api/suppliers/:id`, `DELETE /api/suppliers/:id` | A/S (read) / A (write) | ✓ | Show linked products, edit contact info |
| Add supplier | `POST /api/suppliers` | A | ✓ | Validate required fields |
| Reorder dashboard | `GET /api/suppliers/reorder`, `/api/suppliers/:id/reorder`, `/api/reports/export/{csv,pdf}` | A/S | ✓ | Group by supplier, export suggestions, handle no-shortage case |

## Cart, Checkout & Orders

| Page | Endpoint(s) | Roles | Auth | Scenarios |
| --- | --- | --- | --- | --- |
| Cart | `GET /api/orders/cart`, `POST /api/orders/cart/add`, `PUT /api/orders/cart/update`, `DELETE /api/orders/cart/remove/:productId`, `DELETE /api/orders/cart/clear` | A/S/C | ✓ | Add item, update qty, respect stock limits, clear cart |
| Checkout | `POST /api/orders/checkout` | A/S/C | ✓ | Successful checkout, failure when stock insufficient, cart cleared |
| Orders history | `GET /api/orders` (A/S), `GET /api/orders/me` (C) | A/S/C | ✓ | Status filter, pagination, ensure C sees own orders only |
| Order detail | `GET /api/orders/:orderId` | A/S/C (ownership) | ✓ | Validate access control, display order items + totals |

## Legacy Mockup Templates

| Template Key | Source File | Route | Visual Check |
| --- | --- | --- | --- |
| `add-product` | `src/components/templates/mockups/add_product.html` | `product-form` | Compare layout with live form |
| `product-list-1` | `.../product_list_1.html` | `products` | Card layout parity |
| `cart` | `.../cart.html` | `cart` | Table spacing and totals |
| `stock-levels` | `.../stock_levels.html` | `stock` | Inventory widgets alignment |
| See `mockupRegistry.js` for the complete list covering login, suppliers, reorder, and checkout flows. |

## Regression Checklist

- Verify dark/light scheme tokens render legibly.
- Confirm API errors surface `message` text in toasts or inline alerts.
- Ensure `appState` persists JWT + user after refresh and clears on logout.
- Validate fetch wrapper retries or reports network failures gracefully.
- Smoke-test offline mode (disable network) and confirm mockups remain accessible via the registry.

