// controllers/itemController.js
const Item = require('../models/itemModel');

const itemController = {
  // Get all items
  getAll: async (req, res) => {
    try {
      const items = await Item.getAll();
      res.json(items);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Create a new item
  create: async (req, res) => {
    try {
      const { name, category, price, quantity } = req.body;
      if (!name || price === undefined) {
        return res.status(400).json({ message: 'Name and price are required.' });
      }
      const newItem = await Item.create({
        name,
        category: category || null,
        price,
        quantity: quantity || 0,
      });
      res.status(201).json({ message: 'Item added successfully!', item: newItem });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Update an existing item
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, category, price, quantity } = req.body;
      if (!name || price === undefined) {
        return res.status(400).json({ message: 'Name and price are required.' });
      }
      const updated = await Item.update(id, {
        name,
        category: category || null,
        price,
        quantity: quantity || 0,
      });
      res.json({ message: 'Item updated successfully!', item: updated });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Delete an item
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await Item.delete(id);
      res.json({ message: 'Item deleted successfully!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  },
};

module.exports = itemController;
