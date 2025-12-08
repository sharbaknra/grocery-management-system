const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");
const OrderItem = require("../models/orderItemModel");
const Product = require("../models/productModel");
const Stock = require("../models/stockModel");
const db = require("../config/db");

const checkoutController = {
  // POST /api/orders/checkout
  checkout: async (req, res) => {
    let connection;
    
    try {
      const userId = req.user.id;
      connection = await db.promise().getConnection();
      
      // Get user's cart
      console.log(`[CHECKOUT] Starting checkout for user ${userId}`);
      const cartItems = await Cart.getByUserId(userId);
      console.log(`[CHECKOUT] Cart items retrieved: ${cartItems?.length || 0} items`);
      
      if (!cartItems || cartItems.length === 0) {
        if (connection) connection.release();
        return res.status(400).json({
          success: false,
          message: "Cart is empty. Cannot checkout with an empty cart.",
        });
      }

      // Begin transaction
      console.log(`[CHECKOUT] Beginning transaction`);
      await connection.beginTransaction();

      try {
        // STEP 1: Pre-Transaction Stock Validation (Final check)
        // This is the final stock availability check before committing to the transaction
        const stockValidationErrors = [];
        const validatedItems = [];
        
        for (const cartItem of cartItems) {
          const productId = cartItem.product_id;
          const requestedQty = cartItem.quantity;
          
          // Get current stock with row-level lock (SELECT FOR UPDATE)
          const [stockRows] = await connection.query(
            'SELECT * FROM stock WHERE product_id = ? FOR UPDATE',
            [productId]
          );
          
          if (stockRows.length === 0) {
            throw new Error(`Stock information not found for product ID ${productId}`);
          }
          
          const currentStock = stockRows[0];
          
          // Final validation: ensure sufficient stock
          if (currentStock.quantity < requestedQty) {
            stockValidationErrors.push({
              product_id: productId,
              product_name: cartItem.product_name,
              requested: requestedQty,
              available: currentStock.quantity,
            });
          } else {
            validatedItems.push({
              ...cartItem,
              current_stock: currentStock.quantity,
            });
          }
        }

        // If any item fails stock validation, rollback and return error
        if (stockValidationErrors.length > 0) {
          await connection.rollback();
          return res.status(400).json({
            success: false,
            message: "Insufficient stock for one or more items.",
            errors: stockValidationErrors,
          });
        }

        // STEP 2: Inventory Deduction (Atomic UPDATE with row-level locking)
        // Deduct stock for all validated items
        const stockDeductions = [];
        console.log(`[CHECKOUT] Starting stock deduction for ${validatedItems.length} items`);
        
        for (const item of validatedItems) {
          const productId = item.product_id;
          const quantity = item.quantity;
          
          console.log(`[CHECKOUT] Deducting stock - Product ID: ${productId}, Quantity: ${quantity}`);
          
          // Get current stock before deduction for logging
          const [beforeStock] = await connection.query(
            'SELECT quantity FROM stock WHERE product_id = ?',
            [productId]
          );
          const beforeQty = beforeStock.length > 0 ? beforeStock[0].quantity : 0;
          console.log(`[CHECKOUT] Stock before deduction - Product ${productId}: ${beforeQty}`);
          
          // Atomic decrement with conditional check (prevents negative stock)
          const [result] = await connection.query(
            'UPDATE stock SET quantity = quantity - ? WHERE product_id = ? AND quantity >= ?',
            [quantity, productId, quantity]
          );
          
          console.log(`[CHECKOUT] Stock update result - Product ${productId}:`, {
            affectedRows: result.affectedRows,
            changedRows: result.changedRows,
            warningCount: result.warningCount
          });
          
          if (result.affectedRows === 0) {
            console.error(`[CHECKOUT] Stock deduction failed - Product ${productId}, Requested: ${quantity}, Available: ${beforeQty}`);
            throw new Error(`Failed to deduct stock for product ID ${productId}. Requested: ${quantity}, Available: ${beforeQty}. Stock may have changed.`);
          }
          
          // Verify stock after deduction
          const [afterStock] = await connection.query(
            'SELECT quantity FROM stock WHERE product_id = ?',
            [productId]
          );
          const afterQty = afterStock.length > 0 ? afterStock[0].quantity : 0;
          console.log(`[CHECKOUT] Stock after deduction - Product ${productId}: ${afterQty} (expected: ${beforeQty - quantity})`);
          
          stockDeductions.push({
            product_id: productId,
            quantity: quantity,
          });
        }
        
        console.log(`[CHECKOUT] Stock deduction completed for ${stockDeductions.length} products`);

        // Calculate order totals
        let totalPrice = 0;
        const orderItemsData = [];
        
        for (const item of validatedItems) {
          const itemTotal = parseFloat(item.current_price) * item.quantity;
          totalPrice += itemTotal;
          
          orderItemsData.push({
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price_at_sale: parseFloat(item.current_price), // Critical: store price at time of sale
          });
        }
        
        // Calculate tax and discount (simplified - can be enhanced later)
        const taxRate = 0.10; // 10% tax (example)
        const taxApplied = totalPrice * taxRate;
        const discountApplied = 0.00; // Can be enhanced with discount codes
        const finalTotal = totalPrice + taxApplied - discountApplied;

        // Extract optional customer info from request body (for POS / staff sales)
        const customerName = req.body?.customer_name || null;
        const customerPhone = req.body?.customer_phone || null;

        // STEP 3: Order Record Creation
        console.log(`[CHECKOUT] Creating order - Total: ${finalTotal}, Tax: ${taxApplied}, Discount: ${discountApplied}`);
        const orderData = {
          user_id: userId,
          status: "Completed", // POS checkout is immediate, so status is Completed
          total_price: finalTotal,
          tax_applied: taxApplied,
          discount_applied: discountApplied,
          customer_name: customerName,
          customer_phone: customerPhone,
        };
        
        const [orderResult] = await connection.query(
          'INSERT INTO orders (user_id, status, total_price, tax_applied, discount_applied, customer_name, customer_phone) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [
            orderData.user_id,
            orderData.status,
            orderData.total_price,
            orderData.tax_applied,
            orderData.discount_applied,
            orderData.customer_name,
            orderData.customer_phone,
          ]
        );
        
        const orderId = orderResult.insertId;
        console.log(`[CHECKOUT] Order created with ID: ${orderId}`);

        // STEP 4: Order Item Population
        // Create all order items with unit_price_at_sale
        for (const itemData of orderItemsData) {
          await connection.query(
            'INSERT INTO order_items (order_id, product_id, quantity, unit_price_at_sale) VALUES (?, ?, ?, ?)',
            [orderId, itemData.product_id, itemData.quantity, itemData.unit_price_at_sale]
          );
        }

        // STEP 5: Stock Movement Logging (Module 2.8.7 Integration)
        // Log all stock deductions as "Sale" operations
        for (const deduction of stockDeductions) {
          try {
            await connection.query(
              'INSERT INTO stock_movements (product_id, user_id, change_amount, reason) VALUES (?, ?, ?, ?)',
              [deduction.product_id, userId, -deduction.quantity, 'Sale']
            );
          } catch (logError) {
            // Log error but don't fail transaction if logging fails
            // In production, you might want to log to an error tracking service
            console.error('Error logging stock movement:', logError);
          }
        }

        // STEP 6: Clear cart after successful order creation
        await connection.query('DELETE FROM cart WHERE user_id = ?', [userId]);

        // Commit transaction - all steps succeeded
        console.log(`[CHECKOUT] Committing transaction for order ${orderId}`);
        await connection.commit();
        console.log(`[CHECKOUT] Transaction committed successfully for order ${orderId}`);

        // Get order details with items for response
        const orderDetails = await Order.getById(orderId);
        const orderItems = await OrderItem.getByOrderId(orderId);

        res.status(201).json({
          success: true,
          message: "Checkout completed successfully.",
          data: {
            order_id: orderId,
            order: orderDetails,
            items: orderItems,
            total_price: finalTotal,
            tax_applied: taxApplied,
            discount_applied: discountApplied,
            cart_cleared: true,
          },
        });

      } catch (error) {
        // Rollback transaction on any error
        console.error(`[CHECKOUT] Error in transaction, rolling back:`, error.message);
        await connection.rollback();
        console.error(`[CHECKOUT] Transaction rolled back`);
        throw error; // Re-throw to be caught by outer catch
      }

    } catch (error) {
      console.error("Checkout error:", error);
      
      // Rollback transaction if connection exists and transaction is active
      if (connection) {
        try {
          await connection.rollback();
        } catch (rollbackError) {
          console.error("Error during rollback:", rollbackError);
        }
      }
      
      res.status(500).json({
        success: false,
        message: "Checkout failed. Transaction rolled back.",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    } finally {
      // Always release connection
      if (connection) {
        connection.release();
      }
    }
  },
};

module.exports = checkoutController;

