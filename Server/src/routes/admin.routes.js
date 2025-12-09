const express = require('express');
const router = express.Router();

// Import middleware (assuming these are imported from middleware file)
const { authenticateToken, authorizeRole } = require('./middleware');

// Import controllers (assuming these are imported from controllers file)
const {
  getPendingUsers,
  approveUser,
  getBlogs,
  approveBlog,
  rejectBlog
} = require('./controllers');

// USER MANAGEMENT ROUTES

// GET /api/admin/users/pending - List pending users
router.get('/users/pending', 
  authenticateToken, 
  authorizeRole('admin'), 
  getPendingUsers
);

// PATCH /api/admin/users/:id/approve - Approve user
router.patch('/users/:id/approve', 
  authenticateToken, 
  authorizeRole('admin'), 
  approveUser
);

// BLOG MANAGEMENT ROUTES

// GET /api/admin/blogs - Get all blogs with optional status filter
router.get('/blogs', 
  authenticateToken, 
  authorizeRole('admin'), 
  getBlogs
);

// PATCH /api/admin/blogs/:id/approve - Approve and publish blog
router.patch('/blogs/:id/approve', 
  authenticateToken, 
  authorizeRole('admin'), 
  approveBlog
);

// PATCH /api/admin/blogs/:id/reject - Reject blog with reason
router.patch('/blogs/:id/reject', 
  authenticateToken, 
  authorizeRole('admin'), 
  rejectBlog
);

module.exports = router;