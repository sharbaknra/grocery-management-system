// config/db.js

const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config(); // loads .env variables into process.env

// create a connection pool (better for multiple queries)
const pool = mysql.createPool({
  host: process.env.DB_HOST,      // localhost
  user: process.env.DB_USER,      // root
  password: process.env.DB_PASSWORD, // worstnightmare
  database: process.env.DB_NAME,  // grocery_db
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// check the connection once at startup
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ MySQL connection failed:', err.message);
  } else {
    console.log('✅ Connected to MySQL successfully!');
    connection.release();
  }
});

// export pool directly to support both callbacks and promises
// For callbacks: db.query(sql, params, callback)
// For promises: db.promise().query(sql, params)
module.exports = pool;
