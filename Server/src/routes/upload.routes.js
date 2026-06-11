import { Router } from "express";
import upload from "../middleware/upload.js";
import { uploadFile } from "../services/r2.service.js";
import { authenticate } from "../middleware/auth.js";
import { generalLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post(
  "/upload",
  authenticate,
  generalLimiter,
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err) {
        const status = err.code === "LIMIT_FILE_SIZE" ? 413 : 400;
        return res.status(status).json({
          success: false,
          error: { message: err.message },
        });
      }
      next();
    });
  },
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { message: "No image file provided" },
      });
    }

    try {
      const url = await uploadFile(req.file);
      res.json({ success: true, data: { url } });
    } catch (error) {
      console.error("R2 upload failed:", error);
      res.status(500).json({
        success: false,
        error: { message: "Failed to upload image" },
      });
    }
  },
);

export default router;
