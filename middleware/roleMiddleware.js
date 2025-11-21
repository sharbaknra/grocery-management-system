const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized. No user data found." });
    }

    // Tighten role validation - explicitly reject empty/undefined/invalid roles
    if (!req.user.role || typeof req.user.role !== 'string' || req.user.role.trim() === '') {
      return res.status(401).json({ message: "Unauthorized. No valid role." });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access forbidden. Insufficient privileges." });
    }

    return next();
  };
};

module.exports = allowRoles;


