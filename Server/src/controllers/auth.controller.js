import * as authService from "../services/auth.service.js";

/**
<<<<<<< HEAD
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
=======
 * Register: create user + generate ref_code + set status=pending
 */
export async function register(req, res, next) {
  try {
    const payload = req.body;
    // service should create user and return created user (without password)
    const user = await authService.register(payload);
    res.status(201).json({ message: "User registered", user });
>>>>>>> 5f9e4a115489d823fb1bd7fd4a91f6fbed6c587b
  } catch (err) {
    next(err);
  }
}

<<<<<<< HEAD
/**
 * POST /api/users/set-password
 * Set password using one-time token (received via email after admin approval)
 * Body: { token, password }
 * Response: { message }
 */
export async function setPassword(req, res, next) {
  try {
    const { token, password } = req.body;
    
    // Basic validation
    if (!token || !password) {
      return res.status(400).json({ 
        error: "Missing required fields: token, password" 
      });
    }

    if (password.length < 8) {
      return res.status(400).json({ 
        error: "Password must be at least 8 characters long" 
      });
    }

    await authService.setPassword(token, password);
    
    res.json({ 
      message: "Password set successfully. You can now login." 
    });
=======
export async function setPassword(req, res, next) {
  try {
    const { ref_code, password } = req.body;
    await authService.setPassword(ref_code, password);
    res.json({ message: "Password set. You can now login once account is approved." });
>>>>>>> 5f9e4a115489d823fb1bd7fd4a91f6fbed6c587b
  } catch (err) {
    next(err);
  }
}

<<<<<<< HEAD
/**
 * POST /api/auth/login
 * Login with email and password
 * Body: { email, password }
 * Response: { token, user: { id, email, name, role } }
 */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    
    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ 
        error: "Missing required fields: email, password" 
      });
    }

    const result = await authService.login(email, password);
    
    // Optionally set HttpOnly cookie
    if (process.env.USE_COOKIES === 'true') {
      res.cookie('auth_token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
    }
    
    res.json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/auth/me
 * Get current user info (requires authentication)
 * Response: { user }
 */
export async function getCurrentUser(req, res, next) {
  try {
    const userId = req.user.id;
    const user = await authService.getUserById(userId);
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/logout
 * Logout user (clear cookie if used)
 * Response: { message }
 */
export async function logout(req, res, next) {
  try {
    if (process.env.USE_COOKIES === 'true') {
      res.clearCookie('auth_token');
    }
    res.json({ message: "Logged out successfully" });
=======
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const token = await authService.login(email, password);
    res.json({ token });
>>>>>>> 5f9e4a115489d823fb1bd7fd4a91f6fbed6c587b
  } catch (err) {
    next(err);
  }
}
