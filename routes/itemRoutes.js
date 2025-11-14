const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// ✅ Anyone logged in can view all items
router.get('/', verifyToken, itemController.getAll);

// ✅ Only admins can add new items
router.post('/', verifyToken, verifyAdmin, itemController.create);

// ✅ Only admins can update an item
router.put('/:id', verifyToken, verifyAdmin, itemController.update);

// ✅ Only admins can delete an item
router.delete('/:id', verifyToken, verifyAdmin, itemController.delete);

module.exports = router;
