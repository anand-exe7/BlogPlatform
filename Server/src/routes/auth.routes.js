import express from "express";
import * as authController from "../controllers/auth.controller.js";
<<<<<<< HEAD
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Public routes (no authentication required)
router.post("/login", authController.login);
router.post("/logout", authController.logout);

// Protected routes (authentication required)
router.get("/me", authenticate, authController.getCurrentUser);
=======

const router = express.Router();

// note: mounted at /api/auth
router.post("/register", authController.register);
router.post("/set-password", authController.setPassword);
router.post("/login", authController.login);
>>>>>>> 5f9e4a115489d823fb1bd7fd4a91f6fbed6c587b

export default router;
