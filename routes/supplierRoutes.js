const express = require("express");
const router = express.Router();

const supplierController = require("../controllers/supplierController");
const verifyToken = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

// Supplier Directory (Module 2.8.4)
router.post(
  "/",
  verifyToken,
  allowRoles("admin", "manager"),
  supplierController.createSupplier
);

router.get(
  "/",
  verifyToken,
  allowRoles("admin", "manager", "staff", "purchasing"),
  supplierController.getSuppliers
);

router.get(
  "/reorder",
  verifyToken,
  allowRoles("admin", "manager", "staff", "purchasing"),
  supplierController.getReorderDashboard
);

router.get(
  "/:id",
  verifyToken,
  allowRoles("admin", "manager", "staff", "purchasing"),
  supplierController.getSupplierById
);

router.put(
  "/:id",
  verifyToken,
  allowRoles("admin", "manager"),
  supplierController.updateSupplier
);

router.delete(
  "/:id",
  verifyToken,
  allowRoles("admin", "manager"),
  supplierController.deleteSupplier
);

router.get(
  "/:id/reorder",
  verifyToken,
  allowRoles("admin", "manager", "staff", "purchasing"),
  supplierController.getSupplierReorderSheet
);

module.exports = router;

