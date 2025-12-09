import express from "express";
import * as authController from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Public routes (no authentication required)
router.post("/login", authController.login);
router.post("/logout", authController.logout);

// Protected routes (authentication required)
router.get("/me", authenticate, authController.getCurrentUser);

export default router;
