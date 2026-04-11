import { AppError } from '../utils/AppError.js';
import { logger } from '../utils/logger.js';

export function errorHandler(err, req, res, next) {
  if (err.isOperational) {
    const response = {
      success: false,
      error: {
        message: err.message,
        code: err.code,
      },
    };

    if (err.errors) {
      response.error.errors = err.errors;
    }

    return res.status(err.statusCode).json(response);
  }

  // Handle regular Error objects
  if (err.message) {
    logger.error('Application error', {
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
    });

    return res.status(400).json({
      success: false,
      error: {
        message: err.message,
        code: 'APPLICATION_ERROR',
      },
    });
  }

  logger.error('Unexpected error', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(500).json({
    success: false,
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_ERROR',
    },
  });
}

export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: {
      message: `Route ${req.method} ${req.path} not found`,
      code: 'NOT_FOUND',
    },
  });
}

export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
