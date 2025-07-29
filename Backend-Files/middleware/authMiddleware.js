// middleware/authMiddleware.js

/**
 * Middleware to enforce authentication and role-based authorization.
 * 
 * @param {Array} allowedRoles - Optional array of allowed user roles (e.g., ['admin', 'user'])
 * @returns Middleware function
 */
function authMiddleware(allowedRoles = []) {
  return function (req, res, next) {
    // Check if user is authenticated via session
    if (!req.session || !req.session.isAuthenticated) {
      console.warn('Unauthorized access attempt. No session or not authenticated.');
      return res.status(401).json({ message: 'Unauthorized: Please login to access this resource.' });
    }

    // Check for role-based access control if roles are specified
    if (allowedRoles.length > 0 && !allowedRoles.includes(req.session.role)) {
      console.warn(`Forbidden: Role "${req.session.role}" is not in allowed roles: ${allowedRoles}`);
      return res.status(403).json({ message: 'Forbidden: You do not have permission to access this resource.' });
    }

    // Passed all checks, continue to next handler
    next();
  };
}

module.exports = authMiddleware;
