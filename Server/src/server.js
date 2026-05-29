import app from "./app.js";

const PORT = process.env.PORT || 5000;

process.on("unhandledRejection", (reason, promise) => {
  console.error("FATAL: Unhandled Rejection at:", promise, "reason:", reason);
  // Optional: process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("FATAL: Uncaught Exception:", error);
  // Optional: process.exit(1);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
