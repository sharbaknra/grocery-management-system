const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware');
const verifyAdmin = require('../middleware/adminMiddleware');

// public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// admin-only route
router.get('/', verifyToken, verifyAdmin, userController.getAllUsers);

module.exports = router;
