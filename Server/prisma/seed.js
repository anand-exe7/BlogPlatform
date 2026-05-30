import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@blogplatform.com";
  const password = process.env.ADMIN_PASSWORD || "Admin@123456";
  const name = "Admin";

  console.log("Creating admin user...");
  console.log(`Email: ${email}`);

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      role: "admin",
      status: "approved",
      password_hash: passwordHash,
      email_verified: true,
    },
    create: {
      name,
      email,
      reg_no: "ADMIN001",
      year: "2024",
      domain: "admin",
      ref_code: "SC-ADMIN001",
      status: "approved",
      role: "admin",
      is_super_admin: true,
      password_hash: passwordHash,
      email_verified: true,
    },
  });

  console.log("Admin created successfully!");

  console.log("Admin created successfully!");
  console.log(`ID: ${admin.id}`);
  console.log(`Role: ${admin.role}`);
  console.log(`Status: ${admin.status}`);
  console.log("\nYou can now login with:");
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  console.log("\n⚠️  Please change the password after first login!");
}

main()
  .catch((e) => {
    console.error("Error creating admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
