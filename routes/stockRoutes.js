const express = require("express");
const router = express.Router();

const stockController = require("../controllers/stockController");
const verifyToken = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

router.post("/restock", verifyToken, allowRoles("admin"), stockController.restock);
router.post("/reduce", verifyToken, allowRoles("admin", "staff"), stockController.reduce);

module.exports = router;


