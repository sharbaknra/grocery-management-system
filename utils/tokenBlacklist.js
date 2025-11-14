// utils/tokenBlacklist.js
// In-memory token blacklist store
// Note: This resets on server restart. For production, consider Redis, MongoDB, or PostgreSQL.

const tokenBlacklist = [];

module.exports = { tokenBlacklist };

