const express = require("express");
const router = express.Router();

const stockController = require("../controllers/stockController");
const verifyToken = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

router.post("/restock", verifyToken, allowRoles("admin"), stockController.restock);
router.post("/reduce", verifyToken, allowRoles("admin", "staff"), stockController.reduce);

// GET LOW STOCK ALERTS (Module 2.8.3)
router.get("/low-stock", verifyToken, allowRoles("admin", "staff"), stockController.getLowStock);

// GET STOCK MOVEMENT HISTORY (Module 2.8.7)
router.get("/movements", verifyToken, allowRoles("admin", "staff"), stockController.getMovementHistory);

module.exports = router;


