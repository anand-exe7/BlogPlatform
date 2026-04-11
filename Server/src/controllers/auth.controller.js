import * as authService from "../services/auth.service.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { AppError } from "../utils/AppError.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, reg_no, year, domain, password } = req.body;

  if (!name || !email || !reg_no || !year || !domain) {
    throw new AppError('Missing required fields: name, email, reg_no, year, domain', 400, 'VALIDATION_ERROR');
  }

  const result = await authService.register({ name, email, reg_no, year, domain, password });

  res.status(201).json({
    success: true,
    data: result
  });
});

export const setPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  if (!password) {
    throw new AppError('Password is required', 400, 'VALIDATION_ERROR');
  }
  if (password.length < 8) {
    throw new AppError('Password must be at least 8 characters', 400, 'VALIDATION_ERROR');
  }
  if (!token) {
    throw new AppError('Token is required', 400, 'VALIDATION_ERROR');
  }

  await authService.setPassword(token, password);

  res.json({
    success: true,
    data: { message: "Password set successfully. You can now login." }
  });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    throw new AppError('Verification token is required', 400, 'VALIDATION_ERROR');
  }

  await authService.verifyEmail(token);

  res.json({
    success: true,
    data: { message: "Email verified successfully. Please wait for admin approval." }
  });
});

export const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError('Email is required', 400, 'VALIDATION_ERROR');
  }

  const result = await authService.requestPasswordReset(email);

  res.json({
    success: true,
    data: result
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Missing required fields: email, password', 400, 'VALIDATION_ERROR');
  }

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

  res.json({
    success: true,
    data: result
  });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await authService.getUserById(req.user.id);

  res.json({
    success: true,
    data: { user }
  });
});

export const logout = asyncHandler(async (req, res) => {
  const tokenFromCookie = req.cookies?.auth_token;
  const authHeader = req.headers?.authorization;
  const tokenFromHeader = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  const tokenToRevoke = tokenFromCookie || tokenFromHeader;

  if (tokenToRevoke) {
    try {
      const { revokeJwt } = await import('../middleware/jwt.js');
      revokeJwt(tokenToRevoke);
    } catch (e) {
      console.error('Warning: failed to revoke token', e);
    }
  }

  if (process.env.USE_COOKIES === 'true') {
    const cookieSecure = process.env.COOKIE_SECURE === 'true' ? true : (process.env.NODE_ENV === 'production');
    const cookieSameSite = process.env.COOKIE_SAME_SITE || 'lax';
    res.cookie('auth_token', '', { httpOnly: true, secure: cookieSecure, sameSite: cookieSameSite, maxAge: 0 });
  }

  res.json({
    success: true,
    data: { message: "Logged out successfully" }
  });
});
