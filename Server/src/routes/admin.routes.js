import express from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import { getPendingUsers, approveUser, getBlogs, approveBlog, rejectBlog } from '../controllers/admin.controller.js';

const router = express.Router();

router.get('/users/pending', authenticate, requireRole('admin'), getPendingUsers);
router.patch('/users/:id/approve', authenticate, requireRole('admin'), approveUser);
router.get('/blogs', authenticate, requireRole('admin'), getBlogs);
router.patch('/blogs/:id/approve', authenticate, requireRole('admin'), approveBlog);
router.patch('/blogs/:id/reject', authenticate, requireRole('admin'), rejectBlog);

export default router;
