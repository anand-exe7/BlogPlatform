import express from "express";
import * as authController from "../controllers/auth.controller.js";
import * as interactionController from "../controllers/interaction.controller.js";
import { registrationLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/register", registrationLimiter, authController.register);
router.post("/set-password", authController.setPassword);
router.post("/verify-email", authController.verifyEmail);
router.post("/forgot-password", authController.requestPasswordReset);
router.get("/:userId/stats", interactionController.getPublicUserStats);

export default router;
