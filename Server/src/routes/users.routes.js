import express from "express";
import * as authController from "../controllers/auth.controller.js";

const router = express.Router();

// Public routes - User registration and password setup
// POST /api/users/register - Register new user
router.post("/register", authController.register);

// POST /api/users/set-password - Set password with token after admin approval
router.post("/set-password", authController.setPassword);

export default router;
