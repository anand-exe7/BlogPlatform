import express from 'express';
import prisma from '../db/db.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

if (process.env.NODE_ENV === 'production') {
  router.all('*', (req, res) => {
    res.status(404).json({ success: false, error: { message: 'Not found', code: 'NOT_FOUND' } });
  });
} else {
  router.get('/users', authenticate, requireRole('admin'), async (req, res) => {
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

  router.patch('/users/:id/status', authenticate, requireRole('admin'), async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const user = await prisma.user.update({
        where: { id },
        data: { status }
      });

      res.json({ success: true, data: user });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  });
}

export default router;
