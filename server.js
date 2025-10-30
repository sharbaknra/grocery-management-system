// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const db = require('./config/db');
const itemRoutes = require('./routes/itemRoutes'); // <-- import route file

const app = express();
app.use(cors());
app.use(express.json());

// link routes to endpoint
app.use('/api/items', itemRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
