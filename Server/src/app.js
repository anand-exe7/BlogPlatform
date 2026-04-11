import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import registerRoutes from "./routes/index.routes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { generalLimiter } from "./middleware/rateLimiter.js";
import { logger } from "./utils/logger.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(generalLimiter);

app.get("/", (req, res) => res.json({ ok: true, message: "Backend API Working" }));
app.get('/health', (req, res) => res.json({ ok: true, database: 'connected' }));

registerRoutes(app);

app.use(notFoundHandler);

app.use(errorHandler);

export default app;
