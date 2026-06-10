import rateLimit from 'express-rate-limit';
import { AppError } from '../utils/AppError.js';
import { logger } from '../utils/logger.js';

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1500,
  message: { success: false, error: { message: 'Too many requests, please try again later', code: 'RATE_LIMIT' } },
  standardHeaders: true,
  legacyHeaders: false,
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1500,
  message: { success: false, error: { message: 'Too many login attempts, please try again after 15 minutes', code: 'RATE_LIMIT' } },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

export const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 1500,
  message: { success: false, error: { message: 'Too many registration attempts, please try again after an hour', code: 'RATE_LIMIT' } },
  standardHeaders: true,
  legacyHeaders: false,
});

export function createLimiter(windowMs, max, skipSuccessfulRequests = false) {
  return rateLimit({
    windowMs,
    max,
    message: { success: false, error: { message: 'Too many requests', code: 'RATE_LIMIT' } },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests,
    handler: (req, res, next, options) => {
      logger.warn('Rate limit exceeded', { ip: req.ip, path: req.path });
      res.status(429).json(options.message);
    },
  });
}
