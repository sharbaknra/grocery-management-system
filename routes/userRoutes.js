// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const { tokenBlacklist } = require('../utils/tokenBlacklist');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// 🔒 Protected routes
router.post('/logout', verifyToken, (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  // Add token to blacklist
  tokenBlacklist.push(token);
  
  return res.json({ message: 'Logged out successfully' });
});

// 🔒 Protected: only admins can list all users
router.get('/', verifyToken, verifyAdmin, userController.getAllUsers);

module.exports = router;
