const Stock = require("../models/stockModel");
const Product = require("../models/productModel");

const parsePositiveInteger = (value) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
};

const stockController = {
  restock: async (req, res) => {
    try {
      const productId = parsePositiveInteger(req.body.productId);
      const quantity = parsePositiveInteger(req.body.quantity);

      if (!productId || !quantity) {
        return res
          .status(400)
          .json({ success: false, message: "productId and quantity must be positive integers." });
      }

      const product = await Product.getById(productId);
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found." });
      }

      const stockRecord = await Stock.getByProductId(productId);
      if (!stockRecord) {
        return res
          .status(404)
          .json({ success: false, message: "Stock entry not initialized for this product." });
      }

      const result = await Stock.restock(productId, quantity);
      if (result.affectedRows === 0) {
        return res
          .status(500)
          .json({ success: false, message: "Unable to restock inventory. Please try again." });
      }

      // Log stock movement (Module 2.8.7)
      try {
        await Stock.logMovement(productId, req.user.id, quantity, "Restock");
      } catch (logError) {
        console.error("Error logging stock movement:", logError);
        // Don't fail the request if logging fails, but log the error
      }

      const updatedStock = await Stock.getByProductId(productId);

      return res.status(200).json({
        success: true,
        message: "Stock restocked successfully.",
        data: {
          productId,
          previousQuantity: stockRecord.quantity,
          newQuantity: updatedStock.quantity,
          added: quantity,
        },
      });
    } catch (error) {
      console.error("Error during stock restock:", error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  },

  reduce: async (req, res) => {
    try {
      const productId = parsePositiveInteger(req.body.productId);
      const quantity = parsePositiveInteger(req.body.quantity);

      if (!productId || !quantity) {
        return res
          .status(400)
          .json({ success: false, message: "productId and quantity must be positive integers." });
      }

      const product = await Product.getById(productId);
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found." });
      }

      const stockRecord = await Stock.getByProductId(productId);
      if (!stockRecord) {
        return res
          .status(404)
          .json({ success: false, message: "Stock entry not initialized for this product." });
      }

      const result = await Stock.reduce(productId, quantity);
      if (result.affectedRows === 0) {
        return res.status(400).json({
          success: false,
          message: "Insufficient stock to fulfill this request.",
        });
      }

      // Log stock movement (Module 2.8.7)
      // Note: change_amount is negative for reduce operations
      try {
        await Stock.logMovement(productId, req.user.id, -quantity, "Reduce");
      } catch (logError) {
        console.error("Error logging stock movement:", logError);
        // Don't fail the request if logging fails, but log the error
      }

      const updatedStock = await Stock.getByProductId(productId);

      return res.status(200).json({
        success: true,
        message: "Stock reduced successfully.",
        data: {
          productId,
          previousQuantity: stockRecord.quantity,
          newQuantity: updatedStock.quantity,
          deducted: quantity,
        },
      });
    } catch (error) {
      console.error("Error during stock reduction:", error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  },

  setQuantity: async (req, res) => {
    try {
      const productId = parsePositiveInteger(req.body.productId);
      const quantity = parsePositiveInteger(req.body.quantity);

      if (!productId || !quantity) {
        return res
          .status(400)
          .json({ success: false, message: "productId and quantity must be positive integers." });
      }

      const product = await Product.getById(productId);
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found." });
      }

      const stockRecord = await Stock.getByProductId(productId);
      if (!stockRecord) {
        return res
          .status(404)
          .json({ success: false, message: "Stock entry not initialized for this product." });
      }

      const previousQuantity = stockRecord.quantity;
      const result = await Stock.setQuantity(productId, quantity);
      if (result.affectedRows === 0) {
        return res
          .status(500)
          .json({ success: false, message: "Unable to update stock quantity. Please try again." });
      }

      // Log stock movement (Module 2.8.7)
      // Calculate the change amount (can be positive or negative)
      const changeAmount = quantity - previousQuantity;
      try {
        await Stock.logMovement(productId, req.user.id, changeAmount, "Set Quantity");
      } catch (logError) {
        console.error("Error logging stock movement:", logError);
        // Don't fail the request if logging fails, but log the error
      }

      const updatedStock = await Stock.getByProductId(productId);

      return res.status(200).json({
        success: true,
        message: "Stock quantity updated successfully.",
        data: {
          productId,
          previousQuantity,
          newQuantity: updatedStock.quantity,
          changeAmount,
        },
      });
    } catch (error) {
      console.error("Error during stock quantity update:", error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  },

  // Get low stock alerts (Module 2.8.3)
  getLowStock: async (req, res) => {
    try {
      const lowStockItems = await Stock.getLowStock();

      return res.status(200).json({
        success: true,
        message: "Low stock items retrieved successfully.",
        data: {
          items: lowStockItems,
          count: lowStockItems.length,
        },
      });
    } catch (error) {
      console.error("Error retrieving low stock items:", error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  },

  // Get stock movement history (Module 2.8.7)
  getMovementHistory: async (req, res) => {
    try {
      const productId = req.query.productId ? parseInt(req.query.productId) : null;
      const limit = req.query.limit ? parseInt(req.query.limit) : 100;

      // Only Admin and Staff can view movement history
      const history = await Stock.getMovementHistory(productId, limit);

      return res.status(200).json({
        success: true,
        message: "Stock movement history retrieved successfully.",
        data: {
          movements: history,
          count: history.length,
        },
      });
    } catch (error) {
      console.error("Error retrieving stock movement history:", error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  },

  bulkRestock: async (req, res) => {
    try {
      const { items } = req.body; // Array of { productId, quantity }

      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          success: false,
          message: "items must be a non-empty array of { productId, quantity } objects.",
        });
      }

      const results = [];
      const errors = [];

      // Process each item
      for (const item of items) {
        const productId = parsePositiveInteger(item.productId);
        const quantity = parsePositiveInteger(item.quantity);

        if (!productId || !quantity) {
          errors.push({
            productId: item.productId,
            error: "productId and quantity must be positive integers.",
          });
          continue;
        }

        try {
          const product = await Product.getById(productId);
          if (!product) {
            errors.push({
              productId,
              error: "Product not found.",
            });
            continue;
          }

          const stockRecord = await Stock.getByProductId(productId);
          if (!stockRecord) {
            errors.push({
              productId,
              error: "Stock entry not initialized for this product.",
            });
            continue;
          }

          const result = await Stock.restock(productId, quantity);
          if (result.affectedRows === 0) {
            errors.push({
              productId,
              error: "Unable to restock inventory.",
            });
            continue;
          }

          // Log stock movement
          try {
            await Stock.logMovement(productId, req.user.id, quantity, "Purchase Order Restock");
          } catch (logError) {
            console.error(`Error logging stock movement for product ${productId}:`, logError);
          }

          const updatedStock = await Stock.getByProductId(productId);

          results.push({
            productId,
            productName: product.name,
            previousQuantity: stockRecord.quantity,
            newQuantity: updatedStock.quantity,
            added: quantity,
          });
        } catch (error) {
          console.error(`Error restocking product ${productId}:`, error);
          errors.push({
            productId,
            error: error.message || "Internal error during restock.",
          });
        }
      }

      return res.status(200).json({
        success: true,
        message: `Successfully restocked ${results.length} product(s).`,
        data: {
          successful: results,
          failed: errors,
          totalProcessed: items.length,
          successCount: results.length,
          failureCount: errors.length,
        },
      });
    } catch (error) {
      console.error("Error during bulk stock restock:", error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  },
};

module.exports = stockController;


