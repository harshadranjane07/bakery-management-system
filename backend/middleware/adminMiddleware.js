/**
 * Admin Authorization Middleware
 * Ensures the authenticated user has the 'admin' role
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Admin privileges required for this action'
    });
  }
};

module.exports = { adminOnly };
