import express from "express";
import cors from "cors";
import dotenv from "dotenv";
<<<<<<< HEAD
import cookieParser from "cookie-parser";
=======
>>>>>>> 5f9e4a115489d823fb1bd7fd4a91f6fbed6c587b
import registerRoutes from "./routes/index.routes.js";

dotenv.config();

const app = express();

<<<<<<< HEAD
// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true // Allow cookies
}));

app.use(express.json());
app.use(cookieParser()); // Parse cookies
=======
app.use(cors());
app.use(express.json());
>>>>>>> 5f9e4a115489d823fb1bd7fd4a91f6fbed6c587b

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
