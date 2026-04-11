import { validationResult } from 'express-validator';
import { ValidationError } from '../utils/AppError.js';

export function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.path,
      message: err.msg,
    }));
    throw new ValidationError('Validation failed', formattedErrors);
  }
  next();
}

export const registerValidation = [
  {
    field: 'name',
    message: 'Name is required',
    check: (req) => req.body.name && req.body.name.trim().length >= 2,
  },
  {
    field: 'email',
    message: 'Valid email is required',
    check: (req) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.email),
  },
  {
    field: 'reg_no',
    message: 'Registration number is required',
    check: (req) => req.body.reg_no && req.body.reg_no.trim().length > 0,
  },
  {
    field: 'year',
    message: 'Year is required',
    check: (req) => req.body.year && req.body.year.trim().length > 0,
  },
  {
    field: 'domain',
    message: 'Domain is required',
    check: (req) => req.body.domain && req.body.domain.trim().length > 0,
  },
];

export const loginValidation = [
  {
    field: 'email',
    message: 'Email is required',
    check: (req) => req.body.email,
  },
  {
    field: 'password',
    message: 'Password is required',
    check: (req) => req.body.password,
  },
];

export const setPasswordValidation = [
  {
    field: 'password',
    message: 'Password must be at least 8 characters',
    check: (req) => req.body.password && req.body.password.length >= 8,
  },
];

export const blogValidation = [
  {
    field: 'title',
    message: 'Title is required (min 3, max 200 characters)',
    check: (req) => req.body.title && req.body.title.trim().length >= 3 && req.body.title.length <= 200,
  },
  {
    field: 'content',
    message: 'Content is required (min 10 characters)',
    check: (req) => req.body.content && req.body.content.trim().length >= 10,
  },
];

export function validateBody(validations) {
  return (req, res, next) => {
    const errors = [];

    for (const validation of validations) {
      if (!validation.check(req)) {
        errors.push({ field: validation.field, message: validation.message });
      }
    }

    if (errors.length > 0) {
      throw new ValidationError('Validation failed', errors);
    }

    next();
  };
}
