import { PrismaClient } from "@prisma/client";
import { sendMail } from "../middleware/mail.js";
import { generatePasswordToken } from "./auth.service.js";

const prisma = new PrismaClient();

export async function getPendingUsers() {
  return prisma.user.findMany({
    where: { status: 'pending' },
    select: { id: true, name: true, email: true, reg_no: true, year: true, domain: true, ref_code: true, created_at: true },
    orderBy: { created_at: 'desc' }
  });
}

export async function approveUser(id) {
  const token = generatePasswordToken();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  const user = await prisma.user.update({ where: { id }, data: { status: 'approved', set_password_token: token, set_password_expires: expiresAt } });

  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  const setPasswordUrl = `${appUrl}/auth/set-password?token=${token}`;

  const emailText = `Hello ${user.name},\n\nYour account has been approved. Set your password:\n${setPasswordUrl}\n\nThis link expires in 24 hours.\n`;

  await sendMail(user.email, 'Account Approved - Set Your Password', emailText);

  return { message: 'User approved and email sent', user: { id: user.id, email: user.email, status: user.status } };
}