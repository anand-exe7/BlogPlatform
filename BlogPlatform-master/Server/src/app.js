import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import registerRoutes from "./routes/index.routes.js";

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3002',
  credentials: true // Allow cookies
}));

app.use(express.json());
app.use(cookieParser()); // Parse cookies

// health
app.get("/", (req, res) => res.json({ ok: true, message: "Backend API Working ✅" }));

// mount api routes like /api/auth, /api/blogs, /api/admin
registerRoutes(app);

// centralized 404
app.use((req, res) => res.status(404).json({ error: "Not Found" }));

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

export default app;
