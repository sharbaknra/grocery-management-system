const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized. No user data found." });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access forbidden. Insufficient privileges." });
    }

    return next();
  };
};

module.exports = allowRoles;


