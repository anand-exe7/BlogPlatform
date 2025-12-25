import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/auth.js';
import { getPendingUsers, approveUser, getBlogs, approveBlog, rejectBlog } from '../controllers/admin.controller.js';

const router = express.Router();

// USER MANAGEMENT ROUTES

// GET /api/admin/users/pending - List pending users
router.get('/users/pending', authenticate, requireRole('admin'), getPendingUsers);

// PATCH /api/admin/users/:id/approve - Approve user
router.patch('/users/:id/approve', authenticate, requireRole('admin'), approveUser);

// BLOG MANAGEMENT ROUTES

// GET /api/admin/blogs - Get all blogs with optional status filter
router.get('/blogs', authenticate, requireRole('admin'), getBlogs);

// PATCH /api/admin/blogs/:id/approve - Approve and publish blog
router.patch('/blogs/:id/approve', authenticate, requireRole('admin'), approveBlog);

// PATCH /api/admin/blogs/:id/reject - Reject blog with reason
router.patch('/blogs/:id/reject', authenticate, requireRole('admin'), rejectBlog);

export default router;