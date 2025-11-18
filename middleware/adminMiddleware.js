// middleware/adminMiddleware.js

const verifyAdmin = (req, res, next) => {
  // verifyToken should have already run before this!
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized. No user data found.' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access forbidden. Admins only.' });
  }

  next();
};

module.exports = verifyAdmin;

