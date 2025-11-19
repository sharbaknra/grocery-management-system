const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const auth = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");

// CREATE PRODUCT
router.post(
    "/add",
    auth,
    adminOnly,
    upload.single("image"),
    productController.createProduct
);

// GET ALL PRODUCTS
router.get("/", auth, productController.getAllProducts);

// SEARCH PRODUCTS
router.get("/search", auth, productController.searchProducts);

// GET PRODUCT BY ID
router.get("/:id", auth, productController.getProductById);

// UPDATE PRODUCT
router.put(
    "/update/:id",
    auth,
    adminOnly,
    upload.single("image"),
    productController.updateProduct
);

// DELETE PRODUCT
router.delete("/delete/:id", auth, adminOnly, productController.deleteProduct);

module.exports = router;

