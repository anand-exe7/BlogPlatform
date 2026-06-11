import express from "express";
import * as blogsController from "../controllers/blogs.controller.js";
import { authenticate, optionalAuth } from "../middleware/auth.js";
import { ensureMember } from "../middleware/role.js";
import { uploadImage } from '../middleware/upload.js';

const router = express.Router();

// Public endpoints (optional auth - user info attached if token present)
router.get("/public", optionalAuth, blogsController.getPublicBlogs);
router.get("/public/:id", optionalAuth, blogsController.getPublicBlogById);

// Member endpoints (require auth + member role)
router.use(authenticate);
router.post('/upload-image', uploadImage.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: { message: 'No file uploaded' } });
  }
  res.json({ success: true, data: { url: req.file.path } });
});
router.post("/", ensureMember, blogsController.createDraft);
router.patch("/:id", ensureMember, blogsController.editDraft);
router.delete("/:id", ensureMember, blogsController.deleteDraft);
router.post("/:id/submit", ensureMember, blogsController.submitForReview);
router.get("/my", ensureMember, blogsController.getMyBlogs);

export default router;
