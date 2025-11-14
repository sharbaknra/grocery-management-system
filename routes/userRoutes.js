// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// 🔒 Protected: only admins can list all users
router.get('/', verifyToken, verifyAdmin, userController.getAllUsers);

module.exports = router;
