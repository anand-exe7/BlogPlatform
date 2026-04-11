import express from "express";
import * as authController from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.js";
import { loginLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/login", loginLimiter, authController.login);
router.post("/logout", authController.logout);

router.get("/me", authenticate, authController.getCurrentUser);

export default router;
