// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');

// Register a new user
router.post('/register', userController.register);

// Login user
router.post('/login', userController.login);

// Get all users (protected route)
router.get('/', authenticateToken, userController.getAllUsers);

module.exports = router;
