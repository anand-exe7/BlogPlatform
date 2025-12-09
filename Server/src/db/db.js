import { PrismaClient } from "@prisma/client";

// Create a singleton Prisma client
const prisma = new PrismaClient({
  log: ["query", "error"], // optional: logs queries and errors for debugging
});

export default prisma;
