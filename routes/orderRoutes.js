const express = require("express");
const router = express.Router();

const checkoutController = require("../controllers/checkoutController");
const orderHistoryController = require("../controllers/orderHistoryController");
const verifyToken = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

// POST /api/orders/checkout - Checkout cart (Module 2.9.4)
router.post("/checkout", verifyToken, allowRoles("customer", "admin", "staff"), checkoutController.checkout);

// GET /api/orders - Get all orders (Admin/Staff only) (Module 2.9.5)
// IMPORTANT: Root route must come FIRST before any other GET routes to match correctly
router.get("/", verifyToken, allowRoles("admin", "staff"), orderHistoryController.getAllOrders);

// GET /api/orders/me - Get customer's own orders (Module 2.9.5)
// IMPORTANT: More specific routes must come before parameterized routes
router.get("/me", verifyToken, allowRoles("customer", "admin", "staff"), orderHistoryController.getMyOrders);

// GET /api/orders/:orderId - Get single order by ID
// IMPORTANT: Parameterized route must come LAST
router.get("/:orderId", verifyToken, allowRoles("customer", "admin", "staff"), orderHistoryController.getOrderById);

module.exports = router;

