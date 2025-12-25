import bcrypt from "bcrypt";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";
import { signJwt } from "../middleware/jwt.js";
import { sendMail } from "../middleware/mail.js";

const prisma = new PrismaClient();

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

  // generate unique ref_code
  let ref_code;
  for (let i = 0; i < 10; i++) {
    ref_code = generateRefCode();
    const e = await prisma.user.findUnique({ where: { ref_code } });
    if (!e) break;
  }

  const user = await prisma.user.create({
    data: { ...payload, ref_code, status: 'pending' }
  });

  return { id: user.id, email: user.email, ref_code: user.ref_code, status: user.status };
}

export async function setPassword(tokenOrRef, password) {
  // tokenOrRef may be a one-time token (set_password_token) or a ref_code
  let user = null;
  // try token first
  user = await prisma.user.findUnique({ where: { set_password_token: tokenOrRef } });
  if (!user) {
    // try by ref_code
    user = await prisma.user.findUnique({ where: { ref_code: tokenOrRef } });
  }

  if (!user) throw new Error('Invalid token or reference code');

  // if token was used, check expiry
  if (user.set_password_token === tokenOrRef) {
    if (!user.set_password_expires || user.set_password_expires < new Date()) throw new Error('Token expired');
  }

  if (user.status !== 'approved') throw new Error('User account not approved');

  const hash = await bcrypt.hash(password, 12);
  await prisma.user.update({ where: { id: user.id }, data: { password_hash: hash, set_password_token: null, set_password_expires: null } });
  return true;
}

export async function login(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid credentials');
  if (user.status !== 'approved') throw new Error('Account not approved');
  if (!user.password_hash) throw new Error('Password not set');

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) throw new Error('Invalid credentials');

  const token = signJwt({ id: user.id, role: user.role, email: user.email });
  return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
}

export async function getUserById(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, email: true, reg_no: true, year: true, domain: true, role: true, status: true, created_at: true } });
  if (!user) throw new Error('User not found');
  return user;

}
