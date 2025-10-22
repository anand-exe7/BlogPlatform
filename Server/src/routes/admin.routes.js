const express = require('express');
const router = express.Router();

// Import middleware 
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

//  List pending users
router.get('/users/pending', 
  authenticateToken, 
  authorizeRole('admin'), 
  getPendingUsers
);

//  Approve user
router.patch('/users/:id/approve', 
  authenticateToken, 
  authorizeRole('admin'), 
  approveUser
);

// BLOG MANAGEMENT ROUTES

router.get('/blogs', 
  authenticateToken, 
  authorizeRole('admin'), 
  getBlogs
);

//  Approve and publish blog
router.patch('/blogs/:id/approve', 
  authenticateToken, 
  authorizeRole('admin'), 
  approveBlog
);

//  Reject blog with reason
router.patch('/blogs/:id/reject', 
  authenticateToken, 
  authorizeRole('admin'), 
  rejectBlog
);

module.exports = router;