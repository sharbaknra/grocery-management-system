## Stock State Matrix – UI Surfaces & Expected Behavior

This document maps product stock states (`normal`, `low`, `out-of-stock`) to all pages/components that display stock information and defines the expected UI behavior for each state.

### 1. Stock States (Logical Definitions)

- **Normal stock**
  - Condition: `quantity >= min_stock_level`
  - Typical thresholds:
    - `products` list: `quantity >= 10` → treated as “In Stock”.
    - `product-detail` / `stock` / reports: `quantity >= min_stock_level` (per-product).

- **Low stock**
  - Condition: `0 < quantity < min_stock_level`
  - In `products` list: `0 < quantity < 10` → “Low Stock”.

- **Out of stock**
  - Condition: `quantity <= 0`

### 2. Pages & Components Involved

- `products` list page (`products`)
- `product-detail` page (`product-detail`)
- `stock levels` page (`stock`)
- `reports` page – inventory/low-stock report (`reports`)
- `reorder dashboard` page (`reorder-dashboard`)
- `POS` page (`pos`) – enforces stock by filtering products and respecting stock in cart.
- `cart` & `checkout` pages – enforce stock via backend rules (no explicit badges).

### 3. Matrix: Visual Indicators per Page

#### 3.1 Product List (`products`)

- Source: `frontend/src/pages/products/listPage.js` (`getStockStatus` helper).

| State          | Condition                     | Badge Label    | Badge Classes                            | Other UI Expectations                     |
| -------------- | ---------------------------- | ------------- | ---------------------------------------- | ----------------------------------------- |
| Normal stock   | `quantity >= 10`             | `In Stock`    | `bg-success/10 text-success` + green dot | Product card is fully usable.             |
| Low stock      | `0 < quantity < 10`          | `Low Stock`   | `bg-warning/10 text-warning` + amber dot | Card still allows add-to-cart/edit/view.  |
| Out of stock   | `quantity <= 0`              | `Out of Stock`| `bg-danger/10 text-danger` + red dot     | Card shows 0 stock, add-to-cart may fail. |

Tests should assert:
- Cards show the correct label and color class for each threshold.
- The same product shows the same label as on `product-detail`, `stock`, and `reports` for the same quantity.

#### 3.2 Product Detail (`product-detail`)

- Source: `frontend/src/pages/products/detailPage.js` (`getStockStatus` helper).

| State          | Condition                           | Badge Label    | Badge Classes                            | Other UI Expectations                                  |
| -------------- | ----------------------------------- | ------------- | ---------------------------------------- | ------------------------------------------------------ |
| Normal stock   | `quantity >= min_stock_level`       | `In Stock`    | `bg-success/10 text-success` + green dot | `Update Stock` button navigates to `stock` page.      |
| Low stock      | `0 < quantity < min_stock_level`    | `Low Stock`   | `bg-warning/10 text-warning` + amber dot | “Low Stock” shown in stock card, matches other pages. |
| Out of stock   | `quantity <= 0`                     | `Out of Stock`| `bg-danger/10 text-danger` + red dot     | Add-to-cart should still call backend but may fail.   |

Tests should assert:
- `[data-stock-quantity]`, `[data-stock-min]`, `[data-stock-status]` stay in sync.
- After stock changes via `stock` page or via order checkout, reloading this page shows updated status.

#### 3.3 Stock Levels (`stock`)

- Source: `frontend/src/pages/stock/levelsPage.js` (`getStockStatus` helper).

| State          | Condition                           | Status Label   | Badge Classes                            | Other UI Expectations                                             |
| -------------- | ----------------------------------- | ------------- | ---------------------------------------- | ----------------------------------------------------------------- |
| Normal stock   | `quantity >= min_stock_level`       | `OK`          | `bg-success/10 text-success` + green dot | Filter `status = ok` shows only these rows.                       |
| Low stock      | `0 < quantity < min_stock_level`    | `Low Stock`   | `bg-warning/10 text-warning` + amber dot | Filter `status = low` shows only these rows.                      |
| Out of stock   | `quantity <= 0`                     | `Out of Stock`| `bg-danger/10 text-danger` + red dot     | Filter `status = out` shows only these rows.                      |

Tests should assert:
- Status chips in the `Status` column match the quantity/min-level logic.
- Status filter (`data-filter-status`) includes the correct rows for `ok`, `low`, `out`.
- After using the update modal to restock/reduce, the status chip updates accordingly.

#### 3.4 Reports – Inventory Status (`reports`)

- Source: `frontend/src/pages/reports/reportsPage.js` → `renderInventoryReport`.

| State          | Condition            | Label         | Badge Classes                            |
| -------------- | -------------------- | ------------- | ---------------------------------------- |
| Normal stock   | `qty >= min`        | `OK`          | `bg-success/10 text-success` + green dot |
| Low stock      | `0 < qty < min`     | `Low Stock`   | `bg-warning/10 text-warning` + amber dot |
| Out of stock   | `qty <= 0`          | `Out of Stock`| `bg-danger/10 text-danger` + red dot     |

Tests should assert:
- Given a product fixture in each state, the inventory report row shows the correct label and color.
- The report’s interpretation of `low-stock` matches `/api/stock/low-stock` and the `stock` page rows.

#### 3.5 Reorder Dashboard (`reorder-dashboard`)

- Source: `frontend/src/pages/suppliers/reorderPage.js`.

| State          | Condition                 | Appearance                       | Behavior                                                        |
| -------------- | ------------------------ | -------------------------------- | --------------------------------------------------------------- |
| Low stock      | `quantity < min_stock_level` | Grouped under supplier, always listed | `Shortage` and `Suggested` quantities computed and displayed.   |
| Out of stock   | `quantity <= 0`          | Treated as max shortage          | Suggested reorder at least `min_stock_level`.                   |

Tests should assert:
- Grouping per supplier contains all products that are low/out-of-stock.
- `Shortage` = `max(0, min_stock_level - quantity)` and `Suggested` ≥ `Shortage`.
- Adding items (via `data-add-product` or `data-add-all-supplier`) updates `[data-order-count]`.

### 4. Matrix: Behavioral Rules Across Pages

#### 4.1 Adding to Cart / POS Flows

- **POS (`pos` page)**
  - Only products with `quantity > 0` are listed in the POS grid.
  - Cart logic enforces:
    - `newQuantity <= stock` (alerts when limit reached).
  - After a successful checkout:
    - Backend reduces stock.
    - POS reloads products (`loadProducts`) and should no longer show products that went to `quantity <= 0`.

- **Products list / product detail / cart / checkout**
  - Product add-to-cart actions rely on backend stock enforcement:
    - If the backend rejects due to insufficient stock, UI shows an error (button label changes to error state, or error banner where applicable).
  - After checkout:
    - `stock` page, `products` list, `product-detail`, and `reports` should all reflect reduced quantities.

#### 4.2 Restocking & Reducing Stock

- **Stock page modal**
  - Restock:
    - Increases quantity by `quantity` in payload.
    - Can transition product from `Out of Stock` → `Low Stock` → `OK`.
  - Reduce:
    - Decreases quantity; must not go negative (backend enforces).
    - Can push product into `Low Stock` or `Out of Stock`.

- UI propagation expectations:
  - After restocking/reducing via `stock`:
    - `stock` table row updates immediately (`loadStock()`).
    - Reloading `products`, `product-detail`, `reports`, and `reorder-dashboard` should show the new state.

### 5. Scenario-Based Interconnectivity Tests

Use these scenarios as end-to-end checks for consistent low-stock behavior.

#### Scenario A – Manual Restock to Normal

1. Set product `P` to `quantity = 2`, `min_stock_level = 10` (via backend/fixtures).
2. Verify:
   - `products` card shows `Low Stock`.
   - `product-detail` stock card shows `Low Stock`.
   - `stock` page status shows `Low Stock`.
   - `reports` inventory report lists `P` as `Low Stock`.
   - `reorder-dashboard` includes `P` under its supplier group.
3. From `stock` page, restock `P` by `+10` (new quantity ≥ 12).
4. Verify again:
   - All above pages now show `In Stock` / `OK`.
   - `reorder-dashboard` no longer lists `P`.

#### Scenario B – POS Checkout Drives Product to Low Stock

1. Start with product `P` at `quantity = 10`, `min_stock_level = 5`.
2. In `pos`, add `P` with quantity `6` and complete sale.
3. After checkout:
   - `stock` page shows `quantity = 4` and status `Low Stock`.
   - `products` list badge changes to `Low Stock`.
   - `product-detail` shows `Low Stock`.
   - `reports` inventory report shows `Low Stock`.
   - `reorder-dashboard` now lists `P`.

#### Scenario C – POS Checkout Drives Product to Out of Stock

1. Start with product `P` at `quantity = 3`, `min_stock_level = 2`.
2. In `pos`, sell all `3` units.
3. After checkout:
   - `stock` page shows `quantity = 0`, status `Out of Stock`.
   - `products` list badge shows `Out of Stock`.
   - `product-detail` shows `Out of Stock`.
   - `reports` inventory/low-stock reports show `Out of Stock`.
   - `reorder-dashboard` lists `P` with shortage at least `min_stock_level`.
   - POS product grid no longer lists `P` (filtered to quantity > 0).


