const express = require("express");
const router = express.Router();

const stockController = require("../controllers/stockController");
const verifyToken = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

router.post("/restock", verifyToken, allowRoles("admin", "manager"), stockController.restock);
router.post("/reduce", verifyToken, allowRoles("admin", "manager"), stockController.reduce);

// GET LOW STOCK ALERTS (Module 2.8.3)
router.get("/low-stock", verifyToken, allowRoles("admin", "manager", "staff", "purchasing"), stockController.getLowStock);

// GET STOCK MOVEMENT HISTORY (Module 2.8.7)
router.get("/movements", verifyToken, allowRoles("admin", "manager", "staff", "purchasing"), stockController.getMovementHistory);

module.exports = router;


