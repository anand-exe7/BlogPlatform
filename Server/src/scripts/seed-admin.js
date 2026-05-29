/**
 * Seed Admin User Script
 * Creates an admin user for testing and development
 * 
 * Usage: node src/scripts/seed-admin.js
 */

import bcrypt from "bcrypt";
import prisma from "../db/db.js";
import dotenv from "dotenv";

async function createAdminUser() {
  try {
    console.log("🌱 Seeding admin user...\n");

    const adminEmail = "admin@example.com";
    const adminPassword = "admin123"; // Change this in production!

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (existingAdmin) {
      console.log("⚠️  Admin user already exists!");
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Role: ${existingAdmin.role}`);
      console.log(`   Status: ${existingAdmin.status}\n`);
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(adminPassword, 12);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        name: "Admin User",
        email: adminEmail,
        reg_no: "ADMIN001",
        year: "Staff",
        domain: "Administration",
        ref_code: "ADMIN-REF-001",
        status: "approved",
        password_hash: passwordHash,
        role: "admin"
      }
    });

    console.log("✅ Admin user created successfully!\n");
    console.log("📧 Email:", admin.email);
    console.log("🔑 Password:", adminPassword);
    console.log("👤 Role:", admin.role);
    console.log("📋 Status:", admin.status);
    console.log("\n⚠️  IMPORTANT: Change the admin password after first login!\n");
    console.log("Login endpoint: POST http://localhost:5000/api/auth/login");
    console.log(`Body: { "email": "${admin.email}", "password": "${adminPassword}" }\n`);

  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
