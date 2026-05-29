import express from 'express';
import prisma from '../db/db.js';

const router = express.Router();

// GET all users for development debugging
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        role: true,
        created_at: true
      },
      orderBy: { created_at: 'desc' }
    });
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH approve/reject user status without admin auth (DEV ONLY)
router.patch('/users/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'approved' or 'pending' or 'rejected'
    
    const user = await prisma.user.update({
      where: { id },
      data: { status }
    });
    
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

export default router;
