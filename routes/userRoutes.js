const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');

// public routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

// Staff management routes (admin and manager only)
router.get('/', verifyToken, allowRoles('admin', 'manager'), userController.getAllUsers);
router.post('/staff', verifyToken, allowRoles('admin', 'manager'), userController.createStaff);
router.get('/:id', verifyToken, allowRoles('admin', 'manager'), userController.getUserById);
router.put('/:id', verifyToken, allowRoles('admin', 'manager'), userController.updateUser);
router.delete('/:id', verifyToken, allowRoles('admin', 'manager'), userController.deleteUser);

module.exports = router;
