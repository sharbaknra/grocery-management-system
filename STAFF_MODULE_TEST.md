# Staff Module Testing Guide

## Overview
This document outlines the testing process for the Staff module, including POS checkout, order history, and billing functionality.

## Fixed Issues

### 1. POS Checkout Response Handling
- **Issue**: Checkout response structure wasn't being parsed correctly
- **Fix**: Updated `posPage.js` to handle multiple response structures:
  ```javascript
  const orderId = result?.data?.order_id || result?.order_id || result?.data?.order?.order_id || result?.orderId || result?.id || "---";
  ```
- **Also**: Added cart clearing after successful checkout

### 2. Order History Display
- **Issue**: Order history page wasn't displaying orders correctly due to field name mismatches
- **Fix**: Updated `historyPage.js` to handle:
  - `order_id` vs `id` field names
  - `total_price` vs `total_amount` vs `total`
  - `user_name` vs `customer_name`
  - `item_count` vs `items.length`
  - Proper status class handling

### 3. API Response Structure
- **Issue**: Inconsistent API response structures
- **Fix**: Added robust response parsing in `loadOrders()`:
  ```javascript
  const orderList = Array.isArray(response) 
    ? response 
    : (response?.data?.orders || response?.orders || response?.data || []);
  ```

## Testing Checklist

### 1. POS Checkout Flow
- [ ] Login as staff (staff@grocery.com / staff123)
- [ ] Navigate to POS page
- [ ] Add products to cart
- [ ] Select payment method (Cash/Card)
- [ ] Complete sale
- [ ] Verify success modal shows correct order ID
- [ ] Verify cart is cleared after checkout
- [ ] Verify products stock is updated

### 2. Order History
- [ ] Navigate to Orders page
- [ ] Verify new order appears in the list
- [ ] Verify order details are correct:
  - Order ID
  - Date/Time
  - Customer name
  - Item count
  - Total amount
  - Payment method
  - Status
- [ ] Test search functionality
- [ ] Test date filter

### 3. Order Details
- [ ] Click "View Details" on an order
- [ ] Verify order detail page loads correctly
- [ ] Verify all order information is displayed:
  - Order ID
  - Customer information
  - Payment information
  - Order items with prices
  - Totals (subtotal, tax, discount, total)
- [ ] Test print receipt functionality

### 4. Billing/Invoices
- [ ] Navigate to Billing page
- [ ] Verify invoices list loads
- [ ] Verify new order appears as invoice
- [ ] Click to view invoice details
- [ ] Verify invoice information is correct
- [ ] Test print/download functionality

### 5. Data Synchronization
- [ ] Make a sale as staff
- [ ] Verify order appears in:
  - Staff's order history
  - Manager's order history (if manager views)
  - Billing/invoices list
- [ ] Verify stock levels are updated
- [ ] Verify order can be viewed by manager

## Expected Behavior

### After Checkout:
1. Order is created in database with:
   - Correct user_id (staff member)
   - Correct payment_method
   - Correct total_price
   - All order items with unit_price_at_sale
   - Status: "completed"

2. Stock is reduced:
   - Stock quantities updated
   - Stock movements logged

3. Cart is cleared:
   - Local cart cleared
   - API cart cleared

4. Order appears in:
   - Order history immediately (on next page load)
   - Billing/invoices list
   - Manager dashboard (recent orders)

## API Endpoints Used

- `POST /api/orders/checkout` - Create order from cart
- `GET /api/orders` - Get all orders (staff can access)
- `GET /api/orders/:orderId` - Get order details
- `GET /api/billing/invoices` - Get invoices list
- `GET /api/orders/cart` - Get cart
- `POST /api/orders/cart/add` - Add item to cart
- `DELETE /api/orders/cart/clear` - Clear cart

## Common Issues & Solutions

### Issue: Order not appearing in history
**Solution**: 
- Check if order was created (check database)
- Verify API response structure matches frontend expectations
- Check browser console for errors
- Verify user has correct role permissions

### Issue: Wrong order ID displayed
**Solution**:
- Check checkout response structure
- Verify order_id extraction logic
- Check database for actual order_id

### Issue: Stock not updating
**Solution**:
- Check stock movements table
- Verify transaction completed successfully
- Check for rollback errors in logs

## Test Credentials

- **Staff**: staff@grocery.com / staff123
- **Manager**: admin@grocery.com / admin123

## Notes

- Orders are created with the staff member's user_id
- All orders are visible to staff, manager, and admin
- Order status is set to "completed" by default
- Payment method is stored with the order
- Stock is automatically deducted on successful checkout

