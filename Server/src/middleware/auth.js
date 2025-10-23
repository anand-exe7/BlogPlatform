import jwt from 'jsonwebtoken';
import prisma from '../db/db.js';

// JWT Authentication Middleware
export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({ error: 'Access token required' });
        }

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        // Get user from database
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                name: true,
                email: true,
                status: true,
                role: true
            }
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid token - user not found' });
        }

        // Check if user is verified/approved
        if (user.status !== 'approved') {
            return res.status(403).json({ 
                error: 'Access denied - account not approved',
                status: user.status 
            });
        }

        // Attach user to request object
        req.user = user;
        next();

    } catch (error) {
        console.error('Auth middleware error:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }

        return res.status(500).json({ error: 'Authentication failed' });
    }
};

// Optional: Role-based middleware for admin functions
export const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};

// Optional: Check if user can edit/delete specific blog
export const checkBlogOwnership = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const blog = await prisma.blog.findUnique({
            where: { id },
            select: { author_id: true }
        });

        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        if (blog.author_id !== req.user.id) {
            return res.status(403).json({ error: 'You can only modify your own blogs' });
        }

        next();
    } catch (error) {
        console.error('Blog ownership check error:', error);
        return res.status(500).json({ error: 'Authorization check failed' });
    }
};
