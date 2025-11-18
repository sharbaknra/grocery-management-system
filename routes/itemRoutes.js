const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const verifyToken = require('../middleware/authMiddleware');
const verifyAdmin = require('../middleware/adminMiddleware');

// public
router.get('/', itemController.getAll);

// admin-only
router.post('/', verifyToken, verifyAdmin, itemController.create);
router.put('/:id', verifyToken, verifyAdmin, itemController.update);
router.delete('/:id', verifyToken, verifyAdmin, itemController.delete);

module.exports = router;
