const Product = require("../models/productModel");
const Stock = require("../models/stockModel"); // <<< Import the new Stock Model
const Supplier = require("../models/supplierModel");

const productController = {
  // CREATE PRODUCT + INITIALIZE STOCK (Updated for 2.8.1)
  createProduct: async (req, res) => {
    try {
      // Input validation - reject negative prices
      if (req.body.price !== undefined) {
        const price = parseFloat(req.body.price);
        if (isNaN(price) || price < 0) {
          return res.status(400).json({
            success: false,
            message: "Price must be a non-negative number"
          });
        }
      }

      // Input validation - reject negative quantities
      if (req.body.quantity !== undefined) {
        const quantity = parseInt(req.body.quantity);
        if (isNaN(quantity) || quantity < 0) {
          return res.status(400).json({
            success: false,
            message: "Quantity must be a non-negative integer"
          });
        }
      }

      const imageUrl = req.file ? req.file.filename : null;
      // Separate quantity from product details
      const { quantity, supplierId, ...productData } = req.body;
      const initialStock = quantity || 0;

      let supplierRecord = null;
      if (supplierId) {
        const parsedSupplierId = parseInt(supplierId, 10);
        if (isNaN(parsedSupplierId) || parsedSupplierId <= 0) {
          return res.status(400).json({
            success: false,
            message: "supplierId must be a positive integer",
          });
        }
        supplierRecord = await Supplier.getById(parsedSupplierId);
        if (!supplierRecord) {
          return res.status(404).json({
            success: false,
            message: "Supplier not found.",
          });
        }
      }

      const data = { ...productData, supplier_id: supplierRecord ? supplierRecord.id : null, image_url: imageUrl };

      // 1. Create Product (only details)
      const productId = await Product.create(data);

      // 2. Initialize Stock record using the new Stock model
      await Stock.create(productId, initialStock);

      res.status(201).json({
        message: "Product created successfully",
        productId: productId,
      });
    } catch (err) {
      console.error("Error creating product:", err);
      res.status(500).json({ message: "Database error", error: err.message });
    }
  },

  // ... All other functions are unchanged, as the model now handles fetching quantity ...

  getAllProducts: async (req, res) => {
    try {
      const { 
        name, 
        category, 
        minPrice, 
        maxPrice 
      } = req.query;

      // 1) Combined search and category filter
      if (name && category) {
        const products = await Product.searchWithFilters(name, category);
        return res.status(200).json(products);
      }

      // 2) Search by name only
      if (name) {
        const products = await Product.search(name);
        return res.status(200).json(products);
      }

      // 3) Filter by category only
      if (category) {
        const products = await Product.filterByCategory(category);
        return res.status(200).json(products);
      }

      // 4) Filter by price range
      if (minPrice && maxPrice) {
        const min = parseFloat(minPrice);
        const max = parseFloat(maxPrice);

        if (isNaN(min) || isNaN(max)) {
          return res.status(400).json({ message: "Invalid price range" });
        }

        const products = await Product.filterByPrice(min, max);
        return res.status(200).json(products);
      }

      // 5) Default: return all products
      const products = await Product.getAll();
      res.status(200).json(products);

    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  getProductById: async (req, res) => {
    try {
      const product = await Product.getById(req.params.id);
      if (!product) return res.status(404).json({ message: "Product not found" });
      res.json(product);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Database error" });
    }
  },

  searchProducts: async (req, res) => {
    try {
      const products = await Product.search(req.query.name || "");
      res.json(products);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Database error" });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const id = req.params.id;
      const existing = await Product.getById(id);
      if (!existing) return res.status(404).json({ message: "Product not found" });

      // Input validation - reject negative prices
      if (req.body.price !== undefined) {
        const price = parseFloat(req.body.price);
        if (isNaN(price) || price < 0) {
          return res.status(400).json({
            success: false,
            message: "Price must be a non-negative number"
          });
        }
      }

      const incoming = req.body;

      let supplierId = existing.supplier_id;
      if (incoming.supplierId !== undefined) {
        const parsedSupplierId = parseInt(incoming.supplierId, 10);
        if (isNaN(parsedSupplierId) || parsedSupplierId <= 0) {
          return res.status(400).json({
            success: false,
            message: "supplierId must be a positive integer",
          });
        }
        const supplierRecord = await Supplier.getById(parsedSupplierId);
        if (!supplierRecord) {
          return res.status(404).json({
            success: false,
            message: "Supplier not found.",
          });
        }
        supplierId = supplierRecord.id;
      }

      const mergedData = {
        name: incoming.name ?? existing.name,
        category: incoming.category ?? existing.category,
        price: incoming.price ?? existing.price,
        barcode: incoming.barcode ?? existing.barcode,
        description: incoming.description ?? existing.description,
        expiry_date: incoming.expiry_date ?? existing.expiry_date,
        supplier_id: supplierId,
        image_url: req.file ? req.file.filename : incoming.image_url ?? existing.image_url,
      };

      await Product.update(id, mergedData);
      res.json({ message: "Product updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Database error" });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const id = req.params.id;
      
      // CRITICAL: Delete stock entry first to maintain data integrity
      // This ensures no orphaned stock records exist when product is deleted
      await Stock.deleteByProductId(id);
      
      // Then delete the product
      const result = await Product.delete(id);
      if (result.affectedRows === 0) return res.status(404).json({ message: "Product not found" });
      res.json({ message: "Product deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Database error" });
    }
  },
};

module.exports = productController;


