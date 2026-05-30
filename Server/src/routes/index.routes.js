<<<<<<< HEAD
import usersRoutes from "./users.routes.js";
=======
>>>>>>> 5f9e4a115489d823fb1bd7fd4a91f6fbed6c587b
import authRoutes from "./auth.routes.js";
import blogsRoutes from "./blogs.routes.js";
import adminRoutes from "./admin.routes.js";

export default function registerRoutes(app) {
<<<<<<< HEAD
  app.use("/api/users", usersRoutes);
=======
>>>>>>> 5f9e4a115489d823fb1bd7fd4a91f6fbed6c587b
  app.use("/api/auth", authRoutes);
  app.use("/api/blogs", blogsRoutes);
  app.use("/api/admin", adminRoutes);
}
