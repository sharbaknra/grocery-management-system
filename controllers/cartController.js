const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Stock = require("../models/stockModel");

const cartController = {
  // POST /api/orders/cart/add
  addToCart: async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      const userId = req.user.id; // From JWT token

      // Input validation
      if (!productId || !quantity) {
        return res.status(400).json({
          success: false,
          message: "Product ID and quantity are required.",
        });
      }

      // Validate quantity is a positive integer
      const qty = parseInt(quantity);
      if (isNaN(qty) || qty <= 0) {
        return res.status(400).json({
          success: false,
          message: "Quantity must be a positive integer.",
        });
      }

      // Step 1: Check product existence (non-locking preliminary check)
      const product = await Product.getById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found.",
        });
      }

      // Step 2: Check stock availability (non-locking preliminary check)
      const stock = await Stock.getByProductId(productId);
      if (!stock) {
        return res.status(404).json({
          success: false,
          message: "Stock information not found for this product.",
        });
      }

      // Get current cart quantity for this product (if exists)
      const existingCartItem = await Cart.getItem(userId, productId);
      const currentCartQty = existingCartItem ? existingCartItem.quantity : 0;
      const newTotalQty = currentCartQty + qty;

      // Validate total quantity doesn't exceed available stock
      if (newTotalQty > stock.quantity) {
        const available = stock.quantity - currentCartQty;
        return res.status(400).json({
          success: false,
          message: `Insufficient stock. Available: ${available > 0 ? available : 0}, Requested: ${qty}.`,
        });
      }

      // Step 3: Add item to cart (or update quantity)
      const cartItem = await Cart.addItem(userId, productId, qty);

      res.status(200).json({
        success: true,
        message: "Item added to cart successfully.",
        data: {
          cart_id: cartItem.cart_id,
          product_id: cartItem.product_id,
          quantity: cartItem.quantity,
          product_name: product.name,
          available_stock: stock.quantity,
        },
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      res.status(500).json({
        success: false,
        message: "Server error while adding item to cart.",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // GET /api/orders/cart (Get user's cart)
  getCart: async (req, res) => {
    try {
      const userId = req.user.id;
      const cartItems = await Cart.getByUserId(userId);
      const cartCount = await Cart.getCartCount(userId);

      res.status(200).json({
        success: true,
        data: {
          items: cartItems,
          total_items: cartCount,
          item_count: cartItems.length,
        },
      });
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({
        success: false,
        message: "Server error while fetching cart.",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // PUT /api/orders/cart/update (Update cart item quantity)
  updateCartItem: async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      const userId = req.user.id;

      if (!productId || quantity === undefined) {
        return res.status(400).json({
          success: false,
          message: "Product ID and quantity are required.",
        });
      }

      const qty = parseInt(quantity);
      if (isNaN(qty) || qty <= 0) {
        return res.status(400).json({
          success: false,
          message: "Quantity must be a positive integer.",
        });
      }

      // Check product and stock
      const product = await Product.getById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found.",
        });
      }

      const stock = await Stock.getByProductId(productId);
      if (!stock || qty > stock.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock. Available: ${stock?.quantity || 0}`,
        });
      }

      await Cart.updateQuantity(userId, productId, qty);

      res.status(200).json({
        success: true,
        message: "Cart item updated successfully.",
      });
    } catch (error) {
      console.error("Error updating cart item:", error);
      res.status(500).json({
        success: false,
        message: "Server error while updating cart item.",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // DELETE /api/orders/cart/remove/:productId
  removeFromCart: async (req, res) => {
    try {
      const { productId } = req.params;
      const userId = req.user.id;

      if (!productId) {
        return res.status(400).json({
          success: false,
          message: "Product ID is required.",
        });
      }

      await Cart.removeItem(userId, parseInt(productId));

      res.status(200).json({
        success: true,
        message: "Item removed from cart successfully.",
      });
    } catch (error) {
      console.error("Error removing from cart:", error);
      res.status(500).json({
        success: false,
        message: "Server error while removing item from cart.",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // DELETE /api/orders/cart/clear
  clearCart: async (req, res) => {
    try {
      const userId = req.user.id;
      await Cart.clearCart(userId);

      res.status(200).json({
        success: true,
        message: "Cart cleared successfully.",
      });
    } catch (error) {
      console.error("Error clearing cart:", error);
      res.status(500).json({
        success: false,
        message: "Server error while clearing cart.",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
};

module.exports = cartController;

