import { PrismaClient } from "@prisma/client";
<<<<<<< HEAD
import { sendMail } from "../middleware/mail.js";
import { generatePasswordToken } from "./auth.service.js";
const prisma = new PrismaClient();

/**
 * Get all pending users awaiting approval
 * GET /api/admin/users/pending
 */
export async function getPendingUsers() {
  return prisma.user.findMany({ 
    where: { status: "pending" }, 
    select: { 
      id: true, 
      name: true, 
      email: true, 
      reg_no: true,
      year: true,
      domain: true,
      ref_code: true,
      created_at: true
    },
    orderBy: { created_at: 'desc' }
  });
}

/**
 * Approve user - generates password setup token and sends email
 * PATCH /api/admin/users/:id/approve
 * @param {string} id - User ID
 */
export async function approveUser(id) {
  // Generate one-time password setup token
  const token = generatePasswordToken();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24); // Token valid for 24 hours

  // Update user status and set token
  const user = await prisma.user.update({ 
    where: { id }, 
    data: { 
      status: "approved",
      set_password_token: token,
      set_password_expires: expiresAt
    } 
  });

  // Send password setup email
  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  const setPasswordUrl = `${appUrl}/auth/set-password?token=${token}`;
  
  const emailText = `
Hello ${user.name},

Your account has been approved!

Please set your password by clicking the link below:
${setPasswordUrl}

This link will expire in 24 hours.

Your reference code: ${user.ref_code}

Best regards,
Club Blog Platform Team
  `;

  await sendMail(
    user.email, 
    "Account Approved - Set Your Password", 
    emailText
  );

  return { 
    message: "User approved and email sent",
    user: {
      id: user.id,
      email: user.email,
      status: user.status
    }
  };
=======
import { sendMail } from "../utils/mail.js";
const prisma = new PrismaClient();

export async function getPendingUsers() {
  return prisma.user.findMany({ where: { status: "pending" }, select: { id: true, name: true, email: true, ref_code: true } });
}

export async function approveUser(id) {
  const user = await prisma.user.update({ where: { id }, data: { status: "approved" } });
  // TODO: send activation email (link to set-password)
  await sendMail(user.email, "Account Approved", `Your account is approved. Use ref code ${user.ref_code} to set password.`);
  return true;
>>>>>>> 5f9e4a115489d823fb1bd7fd4a91f6fbed6c587b
}

export async function getPendingBlogs() {
  return prisma.blog.findMany({ where: { status: "pending_review" }, include: { author: true } });
}

export async function approveBlog(id) {
  await prisma.blog.update({ where: { id }, data: { status: "published" } });
  return true;
}

export async function rejectBlog(id, reason) {
  await prisma.blog.update({ where: { id }, data: { status: "rejected" } });
  // optionally store reason in a separate table or notify author
  return true;
}
