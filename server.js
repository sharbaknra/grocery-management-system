// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const db = require('./config/db'); // MySQL connection
const itemRoutes = require('./routes/itemRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const stockRoutes = require('./routes/stockRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const User = require('./models/userModel');

const app = express();

// === MIDDLEWARE ===
app.use(cors());
app.use(express.json()); // ✅ Enables JSON body parsing
app.use('/uploads', express.static('uploads'));

// === ROUTES ===
app.use('/api/items', itemRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/orders/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// === ERROR HANDLING MIDDLEWARE ===
app.use((err, req, res, next) => {
  // Handle JSON parse errors (malformed JSON in request body)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('JSON parse error:', err.message);
    return res.status(400).json({ 
      message: 'Invalid JSON format in request body',
      error: 'Malformed JSON. Please check your request body syntax.'
    });
  }

  // Handle multer file upload errors
  if (err.name === 'MulterError') {
    console.error('File upload error:', err.message);
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        message: 'File too large',
        error: 'File size exceeds the 3MB limit.'
      });
    }
    return res.status(400).json({ 
      message: 'File upload error',
      error: err.message 
    });
  }

  // Handle all other errors
  console.error('Unhandled error:', err);
  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({ 
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Seed admin user on server start
User.seedAdmin();

// === SERVER START ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
