import prisma from '../db/db.js';
import { sendMail, emailTemplates } from '../middleware/mail.js';
import * as adminService from '../services/admin.service.js';

export const getPendingUsers = async (req, res, next) => {
  try {
    const users = await adminService.getPendingUsers();
    res.json({ success: true, count: users.length, users });
  } catch (err) {
    next(err);
  }
};

export const approveUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await adminService.approveUser(id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const getBlogs = async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = status ? { status } : undefined;
    const blogs = await prisma.blog.findMany({
      where,
      include: { author: { select: { name: true, email: true } } },
      orderBy: { created_at: 'desc' }
    });
    res.json({ success: true, count: blogs.length, blogs });
  } catch (err) {
    next(err);
  }
};

export const approveBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await prisma.blog.findUnique({ where: { id } });
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    if (blog.status !== 'pending_review') return res.status(400).json({ error: 'Blog not pending review' });

    const updated = await prisma.blog.update({ where: { id }, data: { status: 'published', updated_at: new Date() } });

    // notify author
    const author = await prisma.user.findUnique({ where: { id: blog.author_id } });
    if (author) {
      try {
        await sendMail(author.email, 'Blog Post Approved', emailTemplates.blogApproval(blog.title));
      } catch (e) {
        console.error('Warning: failed to send approval email', e);
      }
    }

    res.json({ success: true, message: 'Blog approved and published', blog: updated });
  } catch (err) {
    next(err);
  }
};

export const rejectBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    if (!reason || !reason.trim()) return res.status(400).json({ error: 'Rejection reason is required' });

    const blog = await prisma.blog.findUnique({ where: { id } });
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    if (blog.status !== 'pending_review') return res.status(400).json({ error: 'Blog not pending review' });

    await prisma.blog.update({ where: { id }, data: { status: 'rejected', rejection_reason: reason, updated_at: new Date() } });

    const author = await prisma.user.findUnique({ where: { id: blog.author_id } });
    if (author) {
      try {
        await sendMail(author.email, 'Blog Post Update', emailTemplates.blogRejection(blog.title, reason));
      } catch (e) {
        console.error('Warning: failed to send rejection email', e);
      }
    }

    res.json({ success: true, message: 'Blog rejected', blog: { id, title: blog.title, status: 'rejected', reason } });
  } catch (err) {
    next(err);
  }
};