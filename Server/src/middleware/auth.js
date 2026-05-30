import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

<<<<<<< HEAD
/**
 * Authentication middleware
 * Validates JWT from Authorization header (Bearer token) or HttpOnly cookie
 * Attaches decoded user to req.user { id, role, email }
 */
export function authenticate(req, res, next) {
  let token;

  // Try to get token from Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }
  
  // If not in header, try to get from cookie
  if (!token && process.env.USE_COOKIES === 'true') {
    token = req.cookies?.auth_token;
  }

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }
=======
export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Missing Authorization header" });
  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Invalid Authorization header" });
>>>>>>> 5f9e4a115489d823fb1bd7fd4a91f6fbed6c587b

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, role, email }
    next();
  } catch (err) {
<<<<<<< HEAD
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(401).json({ error: "Invalid token" });
  }
}

/**
 * Helper to create role-checking middleware
 * Usage: requireRole('admin') or requireRole(['admin', 'member'])
 * @param {string|string[]} allowedRoles - Role(s) allowed to access the route
 * @returns {Function} Express middleware
 */
export function requireRole(allowedRoles) {
  // Convert single role to array
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: "Forbidden",
        message: `This action requires one of the following roles: ${roles.join(', ')}`
      });
    }

    next();
  };
}
=======
    return res.status(401).json({ error: "Invalid token" });
  }
}
>>>>>>> 5f9e4a115489d823fb1bd7fd4a91f6fbed6c587b
