import express from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import { getPendingUsers, approveUser, getBlogs, approveBlog, rejectBlog, getDashboardStats, getAllUsers } from '../controllers/admin.controller.js';

const router = express.Router();

router.get('/stats', authenticate, requireRole('admin'), getDashboardStats);
router.get('/users/all', authenticate, requireRole('admin'), getAllUsers);
router.get('/users/pending', authenticate, requireRole('admin'), getPendingUsers);
router.patch('/users/:id/approve', authenticate, requireRole('admin'), approveUser);
router.get('/blogs', authenticate, requireRole('admin'), getBlogs);
router.patch('/blogs/:id/approve', authenticate, requireRole('admin'), approveBlog);
router.patch('/blogs/:id/reject', authenticate, requireRole('admin'), rejectBlog);

export default router;
