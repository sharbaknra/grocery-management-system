// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const db = require('./config/db'); // MySQL connection
const itemRoutes = require('./routes/itemRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// === MIDDLEWARE ===
app.use(cors());
app.use(express.json()); // ✅ Enables JSON body parsing

// === ROUTES ===
app.use('/api/items', itemRoutes);
app.use('/api/users', userRoutes);

// === ERROR HANDLING MIDDLEWARE ===
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// === SERVER START ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
