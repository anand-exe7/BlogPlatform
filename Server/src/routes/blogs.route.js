import { Router } from "express";
import { createBlog, deleteBlog, editBlog, getblogs, getAllBlogs, getMyBlogs, submitBlog } from "../controller/blogs.controller.js";
import { authenticateToken, checkBlogOwnership } from "../middleware/auth.js";

const blogsRouter = Router();


blogsRouter.get('/', getAllBlogs);

blogsRouter.get('/:id', getblogs);

blogsRouter.get('/my/blogs', authenticateToken, getMyBlogs);

blogsRouter.post('/', authenticateToken, createBlog);

blogsRouter.patch('/:id', authenticateToken, checkBlogOwnership, editBlog);

blogsRouter.delete('/:id', authenticateToken, checkBlogOwnership, deleteBlog);

blogsRouter.post('/:id/submit', authenticateToken, checkBlogOwnership, submitBlog);

export default blogsRouter