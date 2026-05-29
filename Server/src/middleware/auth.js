import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { isRevoked } from './jwt.js';

/**
 * Optional authentication middleware
 * Validates JWT if present, but doesn't require it
 * Attaches decoded user to req.user { id, role, email } if valid token provided
 */
export function optionalAuth(req, res, next) {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }
  
  if (!token && process.env.USE_COOKIES === 'true') {
    token = req.cookies?.auth_token;
  }

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (isRevoked(token)) {
      req.user = null;
      return next();
    }
    req.user = payload;
    next();
  } catch (err) {
    req.user = null;
    next();
  }
}

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

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // reject tokens that have been revoked server-side
    if (isRevoked(token)) return res.status(401).json({ error: 'Invalid token' });
    req.user = payload; // { id, role, email }
    next();
  } catch (err) {
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

    // Secure restriction to ensure ONLY the master admin can use administrative APIs
    if (roles.includes('admin') && !req.user.is_super_admin) {
      return res.status(403).json({ 
        error: "Access Denied",
        message: "This administrative area is strictly restricted to the primary system administrator."
      });
    }

    next();
  };
}
