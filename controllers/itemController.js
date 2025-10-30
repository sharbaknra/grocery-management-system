// controllers/itemController.js

const Item = require('../models/itemModel');

// GET /api/items
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.getAll();
    res.json(items);
  } catch (err) {
    console.error('Error fetching items:', err);
    res.status(500).json({ message: 'Server error while fetching items' });
  }
};

// GET /api/items/:id
exports.getItemById = async (req, res) => {
  try {
    const id = req.params.id;
    const item = await Item.getById(id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    console.error('Error fetching item:', err);
    res.status(500).json({ message: 'Server error while fetching item' });
  }
};

// POST /api/items
exports.createItem = async (req, res) => {
  try {
    const { name, category, price, quantity } = req.body;
    const newItem = await Item.create({ name, category, price, quantity });
    res.status(201).json(newItem);
  } catch (err) {
    console.error('Error creating item:', err);
    res.status(500).json({ message: 'Server error while creating item' });
  }
};

// PUT /api/items/:id
exports.updateItem = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, category, price, quantity } = req.body;
    const updated = await Item.update(id, { name, category, price, quantity });
    res.json(updated);
  } catch (err) {
    console.error('Error updating item:', err);
    res.status(500).json({ message: 'Server error while updating item' });
  }
};

// DELETE /api/items/:id
exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    await Item.delete(id);
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error('Error deleting item:', err);
    res.status(500).json({ message: 'Server error while deleting item' });
  }
};
