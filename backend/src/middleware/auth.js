const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token; // Handle JWT via cookies
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({ success: false, statusCode: 401, message: 'Not authorized to access this route', data: null });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({ success: false, statusCode: 401, message: 'User belonging to this token no longer exists', data: null });
    }

    next();
  } catch (err) {
    return res.status(401).json({ success: false, statusCode: 401, message: 'Not authorized to access this route', data: null });
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: `User role '${req.user.role}' is not authorized to access this route`,
        data: null
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
