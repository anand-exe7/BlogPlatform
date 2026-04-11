import express from "express";
import * as interactionController from "../controllers/interaction.controller.js";
import { authenticate, optionalAuth } from "../middleware/auth.js";

const router = express.Router();

// Public routes (optional auth - user info attached if token present)
router.get("/likes/:blogId", optionalAuth, interactionController.getLikes);
router.get("/comments/:blogId", interactionController.getComments);
router.get("/stats/platform", interactionController.getPlatformStats);

// Protected routes (auth required)
router.post("/like/:blogId", authenticate, interactionController.toggleLike);
router.post("/comment/:blogId", authenticate, interactionController.addComment);
router.delete("/comment/:commentId", authenticate, interactionController.deleteComment);

// User stats (auth required)
router.get("/users/me/stats", authenticate, interactionController.getUserStats);

export default router;
