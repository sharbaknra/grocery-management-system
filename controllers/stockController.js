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
};

module.exports = stockController;


