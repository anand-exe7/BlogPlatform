import bcrypt from "bcrypt";
import crypto from "crypto";
import prisma from "../db/db.js";
import { signJwt } from "../middleware/jwt.js";
import { sendMail } from "../middleware/mail.js";

function generateRefCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'SC-';
  for (let i = 0; i < 9; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function generatePasswordToken() {
  return crypto.randomBytes(32).toString('hex');
}

export async function register(payload) {
  const existing = await prisma.user.findUnique({ where: { email: payload.email } });
  if (existing) throw new Error('Email already registered');

  let ref_code;
  for (let i = 0; i < 10; i++) {
    ref_code = generateRefCode();
    const e = await prisma.user.findUnique({ where: { ref_code } });
    if (!e) break;
  }

  // Hash password if provided
  let passwordHash = null;
  if (payload.password) {
    passwordHash = await bcrypt.hash(payload.password, 12);
  }

  const { password, ...userData } = payload;

  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      reg_no: payload.reg_no,
      year: payload.year ? String(payload.year) : '1',
      domain: payload.domain,
      ref_code,
      status: 'pending',
      password_hash: passwordHash,
    }
  });

  return { id: user.id, email: user.email, ref_code: user.ref_code, status: user.status, message: 'Registration successful! Please wait for admin approval.' };
}

export async function setPassword(token, password) {
  const user = await prisma.user.findFirst({
    where: {
      set_password_token: token,
      set_password_expires: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    throw new Error("Invalid or expired token");
  }

  if (user.status !== "approved") {
    throw new Error("User account not approved");
  }

  const hash = await bcrypt.hash(password, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password_hash: hash,
      set_password_token: null,
      set_password_expires: null,
      failed_login_attempts: 0,
      lock_until: null,
    },
  });

  return true;
}


export async function login(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid credentials');

  if (user.lock_until && user.lock_until > new Date()) {
    const minutesLeft = Math.ceil((user.lock_until - new Date()) / 60000);
    throw new Error(`Account locked. Try again in ${minutesLeft} minutes`);
  }

  if (user.status !== 'approved') throw new Error('Account not approved. Please wait for admin approval.');
  if (!user.password_hash) throw new Error('Password not set. Please contact admin.');

  const ok = await bcrypt.compare(password, user.password_hash);

  if (!ok) {
    const attempts = user.failed_login_attempts + 1;
    const lockUntil = attempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        failed_login_attempts: attempts,
        lock_until: lockUntil,
      },
    });

    if (lockUntil) {
      throw new Error('Too many failed attempts. Account locked for 15 minutes');
    }
    throw new Error('Invalid credentials');
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      failed_login_attempts: 0,
      lock_until: null,
    },
  });

  const token = signJwt({ id: user.id, role: user.role, email: user.email, is_super_admin: user.is_super_admin });
  return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role, is_super_admin: user.is_super_admin } };
}

export async function getUserById(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, email: true, reg_no: true, year: true, domain: true, role: true, is_super_admin: true, status: true, created_at: true } });
  if (!user) throw new Error('User not found');
  return user;
}

export async function verifyEmail(token) {
  const user = await prisma.user.findFirst({
    where: { verification_token: token }
  });

  if (!user) {
    throw new Error('Invalid verification token');
  }

  if (user.email_verified) {
    throw new Error('Email already verified');
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      email_verified: true,
      verification_token: null,
    },
  });

  return true;
}

export async function requestPasswordReset(email) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return { message: 'If an account exists with this email, a reset link has been sent' };
  }

  if (user.status !== 'approved') {
    throw new Error('Account not approved. Please contact admin.');
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      set_password_token: resetToken,
      set_password_expires: expiresAt,
    },
  });

  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  const resetUrl = `${appUrl}/auth/reset-password?token=${resetToken}`;

  const { emailTemplates } = await import('../middleware/mail.js');
  await sendMail(user.email, 'Password Reset Request', emailTemplates.passwordReset(user.name, resetUrl));

  return { message: 'If an account exists with this email, a reset link has been sent' };
}

export async function changePassword(userId, currentPassword, newPassword) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');
  if (!user.password_hash) throw new Error('Password not set for this account');

  const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
  if (!isMatch) throw new Error('Incorrect current password');

  const newHash = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: userId },
    data: { password_hash: newHash }
  });

  return { message: 'Password updated successfully' };
}
