const Supplier = require("../models/supplierModel");

const formatSupplierResponse = (supplier) => ({
  id: supplier.id,
  name: supplier.name,
  contact_name: supplier.contact_name,
  phone: supplier.phone,
  email: supplier.email,
  address: supplier.address,
  lead_time_days: supplier.lead_time_days,
  min_order_amount: parseFloat(supplier.min_order_amount),
  notes: supplier.notes,
  created_at: supplier.created_at,
  updated_at: supplier.updated_at,
  product_count: supplier.product_count ? parseInt(supplier.product_count, 10) : undefined,
  low_stock_items: supplier.low_stock_items ? parseInt(supplier.low_stock_items, 10) : undefined,
});

const supplierController = {
  createSupplier: async (req, res) => {
    try {
      const { name, contact_name, phone, email, address, lead_time_days, min_order_amount, notes } = req.body;

      if (!name || name.trim() === "") {
        return res.status(400).json({ success: false, message: "Supplier name is required." });
      }

      const supplierId = await Supplier.create({
        name: name.trim(),
        contact_name,
        phone,
        email,
        address,
        lead_time_days: lead_time_days !== undefined ? parseInt(lead_time_days, 10) : undefined,
        min_order_amount: min_order_amount !== undefined ? parseFloat(min_order_amount) : undefined,
        notes,
      });

      const created = await Supplier.getById(supplierId);
      res.status(201).json({
        success: true,
        message: "Supplier created successfully.",
        data: formatSupplierResponse(created),
      });
    } catch (error) {
      console.error("Error creating supplier:", error);
      res.status(500).json({ success: false, message: "Failed to create supplier." });
    }
  },

  getSuppliers: async (_req, res) => {
    try {
      const suppliers = await Supplier.getAllWithStats();
      res.status(200).json({
        success: true,
        data: suppliers.map(formatSupplierResponse),
      });
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      res.status(500).json({ success: false, message: "Failed to fetch suppliers." });
    }
  },

  getSupplierById: async (req, res) => {
    try {
      const { id } = req.params;
      const supplier = await Supplier.getById(id);
      if (!supplier) {
        return res.status(404).json({ success: false, message: "Supplier not found." });
      }

      const products = await Supplier.getProductsForSupplier(id);
      const orderHistory = await Supplier.getOrderHistoryForSupplier(id, 25);

      res.status(200).json({
        success: true,
        data: {
          supplier: formatSupplierResponse(supplier),
          products,
          order_history: orderHistory,
        },
      });
    } catch (error) {
      console.error("Error fetching supplier detail:", error);
      res.status(500).json({ success: false, message: "Failed to fetch supplier detail." });
    }
  },

  updateSupplier: async (req, res) => {
    try {
      const { id } = req.params;
      const existing = await Supplier.getById(id);
      if (!existing) {
        return res.status(404).json({ success: false, message: "Supplier not found." });
      }

      const payload = {
        name: req.body.name ?? existing.name,
        contact_name: req.body.contact_name ?? existing.contact_name,
        phone: req.body.phone ?? existing.phone,
        email: req.body.email ?? existing.email,
        address: req.body.address ?? existing.address,
        lead_time_days: req.body.lead_time_days !== undefined
          ? parseInt(req.body.lead_time_days, 10)
          : existing.lead_time_days,
        min_order_amount: req.body.min_order_amount !== undefined
          ? parseFloat(req.body.min_order_amount)
          : existing.min_order_amount,
        notes: req.body.notes ?? existing.notes,
      };

      if (!payload.name || payload.name.trim() === "") {
        return res.status(400).json({ success: false, message: "Supplier name is required." });
      }

      await Supplier.update(id, payload);
      const updated = await Supplier.getById(id);
      res.status(200).json({
        success: true,
        message: "Supplier updated successfully.",
        data: formatSupplierResponse(updated),
      });
    } catch (error) {
      console.error("Error updating supplier:", error);
      res.status(500).json({ success: false, message: "Failed to update supplier." });
    }
  },

  deleteSupplier: async (req, res) => {
    try {
      const { id } = req.params;
      const existing = await Supplier.getById(id);
      if (!existing) {
        return res.status(404).json({ success: false, message: "Supplier not found." });
      }

      await Supplier.delete(id);
      res.status(200).json({ success: true, message: "Supplier deleted. Products referencing this supplier retain their history but now have supplier_id = NULL." });
    } catch (error) {
      console.error("Error deleting supplier:", error);
      res.status(500).json({ success: false, message: "Failed to delete supplier." });
    }
  },

  getReorderDashboard: async (_req, res) => {
    try {
      const rows = await Supplier.getReorderList();
      const grouped = rows.reduce((acc, row) => {
        // Use supplier_id or a special key for products without suppliers
        const groupKey = row.supplier_id || 'no_supplier';
        
        if (!acc[groupKey]) {
          acc[groupKey] = {
            supplier_id: row.supplier_id || null,
            supplier_name: row.supplier_name || "No Supplier",
            contact_name: row.contact_name || null,
            phone: row.phone || null,
            email: row.email || null,
            lead_time_days: row.lead_time_days || null,
            min_order_amount: row.min_order_amount ? parseFloat(row.min_order_amount) : 0,
            items: [],
            total_shortage: 0,
            total_suggested_quantity: 0,
          };
        }
        acc[groupKey].items.push({
          product_id: row.product_id,
          product_name: row.product_name,
          category: row.category,
          quantity: row.quantity,
          min_stock_level: row.min_stock_level,
          shortage: row.shortage,
          suggested_order_quantity: row.suggested_order_quantity,
        });
        acc[groupKey].total_shortage += row.shortage;
        acc[groupKey].total_suggested_quantity += row.suggested_order_quantity;
        return acc;
      }, {});

      res.status(200).json({
        success: true,
        data: Object.values(grouped),
        total_suppliers: Object.keys(grouped).length,
      });
    } catch (error) {
      console.error("Error building reorder dashboard:", error);
      res.status(500).json({ success: false, message: "Failed to build reorder dashboard." });
    }
  },

  getSupplierReorderSheet: async (req, res) => {
    try {
      const { id } = req.params;
      const supplier = await Supplier.getById(id);
      if (!supplier) {
        return res.status(404).json({ success: false, message: "Supplier not found." });
      }

      const rows = await Supplier.getReorderList(id);
      res.status(200).json({
        success: true,
        data: {
          supplier: formatSupplierResponse(supplier),
          items: rows.map((row) => ({
            product_id: row.product_id,
            product_name: row.product_name,
            category: row.category,
            quantity: row.quantity,
            min_stock_level: row.min_stock_level,
            shortage: row.shortage,
            suggested_order_quantity: row.suggested_order_quantity,
          })),
        },
      });
    } catch (error) {
      console.error("Error fetching supplier reorder sheet:", error);
      res.status(500).json({ success: false, message: "Failed to fetch supplier reorder sheet." });
    }
  },
};

module.exports = supplierController;

