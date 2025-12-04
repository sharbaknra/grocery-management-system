## UI Testing Checklists – Grocery Management System

These reusable checklists are tailored to the current frontend (pages, services, Tailwind UI) and should be used when writing automated tests or performing structured manual QA.

### 1. Buttons

For each button (primary, secondary, icon-only, table actions, etc.):

- **Rendering**
  - Renders with the correct label/icon for the current context.
  - Correct visual style for type (primary vs. secondary vs. destructive).
  - Disabled state rendered when preconditions (e.g., empty cart, no form changes) are not met.

- **Behavior**
  - Click triggers **exactly one** handler:
    - No duplicate network requests.
    - No double navigation or double toasts.
  - For route buttons (`data-route`):
    - Navigates to the correct page (e.g., `products`, `cart`, `checkout`, `stock`, `order-detail`).
    - URL or internal route state matches expectation.
  - For async actions (e.g., `Confirm Order`, `Add to Cart`, POS `Complete Sale`):
    - Shows a loading state (spinner / text change).
    - Disables the button while the request is in flight.
    - Restores the normal state on success or error.

- **Error Handling**
  - On backend error, button returns to usable state.
  - User-facing error feedback is visible (alert, banner, or inline message).

### 2. Inputs & Forms

For any form (search, filters, product/supplier forms, stock update modal, checkout customer info):

- **Rendering & Binding**
  - All expected fields are visible with correct labels and placeholders.
  - Default values match the current entity (e.g., existing product, existing stock levels).
  - Keyboard focus lands in a sensible field on open (e.g., quantity in stock modal).

- **Validation**
  - Required fields reject empty input with clear error indication.
  - Numeric fields:
    - Enforce min/max (e.g., `min=1` for quantity).
    - Reject non-numeric input where applicable.
  - Logical validation:
    - Stock quantities cannot be negative.
    - Checkout only allowed with at least one cart item.

- **Behavior**
  - Enter key submits where expected (e.g., single-field search).
  - Escape closes dialogs/modals where supported.
  - Submitting a valid form:
    - Triggers the correct API call with correct payload.
    - Shows success feedback (toast, banner, updated view, redirect).
  - Submitting invalid data:
    - Keeps the user on the current form.
    - Does **not** send malformed payloads.

### 3. Dropdowns & Selects

For category filters, sort selects, status filters, and any other selects:

- **Rendering**
  - Default option matches expected default filter (e.g., “All Categories”, “Sort By”, “All Status”).
  - Options list covers all needed categories/status values.

- **Interaction**
  - Opening and closing works via mouse and keyboard.
  - Selection updates underlying filter state.

- **Behavior**
  - Changing a filter triggers:
    - Correct list reload (products, stock, orders, reports).
    - No duplicate requests (debounced filters should still only send one request).
  - Clearing a filter returns to full dataset.

### 4. Modals & Overlays

Applies to the stock update modal, checkout success modal, POS success modal, and any future modals:

- **Accessibility & Focus**
  - Opening the modal:
    - Focus moves into the modal (e.g., first input or primary button).
    - Background content is visually and functionally de-emphasized.
  - Closing the modal:
    - Esc key closes if appropriate.
    - Clicking backdrop closes where allowed (stock modal supports this).
    - Focus returns to the triggering element (e.g., “Update quantity” button).

- **Behavior**
  - Primary action submits the intended operation:
    - Stock modal → calls `stockService.restock` or `stockService.reduce` with correct payload.
    - Checkout/POS success modal → stays in place until user chooses next action.
  - Cancel/close does not submit any changes.
  - Status messages (e.g., `[data-modal-status]`, `[data-checkout-status]`) appear when errors occur and disappear on retry/success.

### 5. Navigation & Routing

For top-level navigation and in-page navigation (breadcrumbs, action links):

- **Configuration**
  - Every route registered in `frontend/src/pages/index.js` has a corresponding page implementation.
  - Invalid route names are handled gracefully (default or fallback page).

- **Behavior**
  - Clicking a `data-route` element:
    - Navigates to the correct page string (e.g., `product-detail`, `stock`, `orders`).
    - Preserves necessary route params (sessionStorage keys like `gms:activeProductId`, `gms:activeOrderId`).
  - Breadcrumb links:
    - Return to expected parent page.
    - Do not break when users use browser back/forward.

### 6. Badges & Status Indicators (Stock-Focused)

For all elements displaying `In Stock`, `Low Stock`, `Out of Stock`, `OK`, etc.:

- **Consistency**
  - For a given product and quantity/min-level:
    - `products` list, `product-detail`, `stock`, `reports`, and `reorder-dashboard` all agree on state.
  - CSS classes (success/warning/danger) match the logical state everywhere.

- **Behavior**
  - After any stock change (restock, reduce, POS sale, checkout):
    - Status updates on next load/refresh of each relevant page.
  - Filters and reports using these states (e.g., status filter on `stock`, low-stock reports) align with badge labels.

### 7. Lists, Tables & Grids

For cart table, stock table, reports tables, orders table, and product grids:

- **Rendering**
  - Headers match columns (ID, date, customer, status, etc.).
  - Empty states are clear and instructive.

- **Data Integrity**
  - Each row uses the correct ID and data fields from the API.
  - Totals/summary fields (cart, checkout, orders, reports) match backend numeric values.

- **Interaction**
  - Row actions (View, Edit, Update quantity, Add to cart, View order) trigger correct handlers/navigations.
  - Pagination (where applicable) loads the correct page and preserves filters.

### 8. Reliability & Repeated Interactions

For high-traffic or critical flows (POS, cart/checkout, stock updates):

- **Multiple Sequential Actions**
  - Repeatedly:
    - Adjust stock via modal.
    - Add/remove items from cart.
    - Complete POS sales.
  - UI remains stable:
    - No duplicate event handlers (no multiple increments per click).
    - No memory leaks or progressively slower updates.

- **Error & Retry**
  - Simulated backend failures (e.g., using mock/failing endpoints) result in:
    - Clear error messaging.
    - No partial or inconsistent UI state.
    - Successful retry path once backend recovers.


