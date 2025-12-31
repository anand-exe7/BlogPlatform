import * as authService from "../services/auth.service.js";

/**
 * POST /api/users/register
 * Register new user - creates user with 'pending' status and unique ref_code
 * Body: { name, email, reg_no, year, domain }
 * Response: { message, user: { id, email, ref_code, status } }
 */
export async function register(req, res, next) {
  try {
    const { name, email, reg_no, year, domain } = req.body;
    
    // Basic validation
    if (!name || !email || !reg_no || !year || !domain) {
      return res.status(400).json({ 
        error: "Missing required fields: name, email, reg_no, year, domain" 
      });
    }

    const user = await authService.register({ name, email, reg_no, year, domain });
    
    res.status(201).json({ 
      message: "Registration successful. Please provide your reference code to admin for approval.",
      user 
    });
  } catch (err) {
    next(err);
  }
}
/**
 * POST /api/users/set-password
 * Set password using one-time token or ref_code depending on flow.
 * Accepts either { token, password } or { ref_code, password }.
 */
export async function setPassword(req, res, next) {
  try {
    const { token, ref_code, password } = req.body;

    if (!password) return res.status(400).json({ error: "Password is required" });
    if (password.length < 8) return res.status(400).json({ error: "Password must be at least 8 characters long" });

    if (token) {
      await authService.setPassword(token, password);
    } else if (ref_code) {
      await authService.setPassword(ref_code, password);
    } else {
      return res.status(400).json({ error: "Either token or ref_code is required" });
    }

    res.json({ message: "Password set successfully. You can now login." });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/login
 * Login with email and password
 */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Missing required fields: email, password" });

    const result = await authService.login(email, password);

    if (process.env.USE_COOKIES === 'true' && result && result.token) {
      const cookieSecure = process.env.COOKIE_SECURE === 'true' ? true : (process.env.NODE_ENV === 'production');
      const cookieSameSite = process.env.COOKIE_SAME_SITE || 'lax';
      res.cookie('auth_token', result.token, {
        httpOnly: true,
        secure: cookieSecure,
        sameSite: cookieSameSite,
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getCurrentUser(req, res, next) {
  try {
    const userId = req.user.id;
    const user = await authService.getUserById(userId);
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res, next) {
  try {
    // Revoke token server-side if present (helps E2E and logout invalidation)
    const tokenFromCookie = req.cookies?.auth_token;
    const authHeader = req.headers?.authorization;
    const tokenFromHeader = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    const tokenToRevoke = tokenFromCookie || tokenFromHeader;
    if (tokenToRevoke) {
      try {
        const { revokeJwt } = await import('../middleware/jwt.js');
        revokeJwt(tokenToRevoke);
      } catch (e) {
        // non-fatal
        console.error('Warning: failed to revoke token', e);
      }
    }

    if (process.env.USE_COOKIES === 'true') {
      // Clear cookie using same options used when setting it so browser accepts the cleared cookie
      const cookieSecure = process.env.COOKIE_SECURE === 'true' ? true : (process.env.NODE_ENV === 'production');
      const cookieSameSite = process.env.COOKIE_SAME_SITE || 'lax';
      // Explicitly set Max-Age=0 so test-suite can detect clearing
      res.cookie('auth_token', '', { httpOnly: true, secure: cookieSecure, sameSite: cookieSameSite, maxAge: 0 });
    }
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
}

