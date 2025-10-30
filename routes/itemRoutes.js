// routes/itemRoutes.js

const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

// Routes mapping URLs to controller functions
router.get('/', itemController.getAllItems);      // GET all items
router.get('/:id', itemController.getItemById);   // GET one item by ID
router.post('/', itemController.createItem);      // POST new item
router.put('/:id', itemController.updateItem);    // PUT update item
router.delete('/:id', itemController.deleteItem); // DELETE item

module.exports = router;
