const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cartController");
const verifyToken = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

// POST /api/orders/cart/add - Add item to cart (Module 2.9.3)
router.post("/add", verifyToken, allowRoles("customer", "admin", "staff"), cartController.addToCart);

// GET /api/orders/cart - Get user's cart
router.get("/", verifyToken, allowRoles("customer", "admin", "staff"), cartController.getCart);

// PUT /api/orders/cart/update - Update cart item quantity
router.put("/update", verifyToken, allowRoles("customer", "admin", "staff"), cartController.updateCartItem);

// DELETE /api/orders/cart/remove/:productId - Remove item from cart
router.delete("/remove/:productId", verifyToken, allowRoles("customer", "admin", "staff"), cartController.removeFromCart);

// DELETE /api/orders/cart/clear - Clear entire cart
router.delete("/clear", verifyToken, allowRoles("customer", "admin", "staff"), cartController.clearCart);

module.exports = router;

