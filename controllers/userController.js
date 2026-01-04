// controllers/userController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { tokenBlacklist } = require('../utils/tokenBlacklist');

const userController = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
      }

      // check if user exists
      const existingUsers = await User.findByEmail(email);
      if (existingUsers.length > 0) {
        return res.status(400).json({ message: 'Email already registered.' });
      }

      // Security: Ignore role from client, always set to 'customer' for public registration
      // Role can only be changed by admin users via separate admin endpoints
      const hashedPassword = await bcrypt.hash(password, 10);
      const role = 'customer'; // Force customer role on public registration
      await User.create({ name, email, password: hashedPassword, role });
      
      res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
      console.error('Registration error:', error);
      // In development, show actual error for debugging
      const errorMessage = process.env.NODE_ENV === 'development' 
        ? error.message 
        : 'Server error';
      res.status(500).json({ 
        error: errorMessage,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
      }

      const result = await User.findByEmail(email);
      if (result.length === 0) return res.status(404).json({ message: 'User not found.' });

      const user = result[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.status(200).json({ message: 'Login successful!', token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  logout: async (req, res) => {
    try {
      // Get token from Authorization header
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        // Add token to blacklist
        tokenBlacklist.push(token);
      }
      res.status(200).json({ message: 'Logout successful!' });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const users = await User.getAll();
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Create staff user (admin/manager only)
  createStaff: async (req, res) => {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'All fields are required.' });
      }

      // Validate role - only allow staff or purchasing roles
      if (!['staff', 'purchasing'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role. Only staff or purchasing roles allowed.' });
      }

      // Check if user exists
      const existingUsers = await User.findByEmail(email);
      if (existingUsers.length > 0) {
        return res.status(400).json({ message: 'Email already registered.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({ name, email, password: hashedPassword, role });
      
      res.status(201).json({ 
        message: 'Staff user created successfully!',
        user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
      });
    } catch (error) {
      console.error('Create staff error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Get user by ID
  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.getById(id);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
      
      res.json(user);
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Update user
  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, role, password } = req.body;

      // Check if user exists
      const existingUser = await User.getById(id);
      if (!existingUser) {
        return res.status(404).json({ message: 'User not found.' });
      }

      // Validate role if provided
      if (role && !['admin', 'manager', 'staff', 'purchasing', 'customer'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role.' });
      }

      // Update user data
      const updateData = {
        name: name || existingUser.name,
        email: email || existingUser.email,
        role: role || existingUser.role
      };

      await User.update(id, updateData);

      // Update password if provided
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.updatePassword(id, hashedPassword);
      }

      const updatedUser = await User.getById(id);
      res.json({ 
        message: 'User updated successfully!',
        user: updatedUser
      });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Delete user
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;

      // Check if user exists
      const existingUser = await User.getById(id);
      if (!existingUser) {
        return res.status(404).json({ message: 'User not found.' });
      }

      // Prevent deleting yourself
      if (req.user.id === parseInt(id)) {
        return res.status(400).json({ message: 'Cannot delete your own account.' });
      }

      await User.delete(id);
      res.json({ message: 'User deleted successfully!' });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
};

module.exports = userController;
