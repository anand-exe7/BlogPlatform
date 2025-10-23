import bcrypt from "bcrypt";
<<<<<<< HEAD
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";
import { signJwt } from "../middleware/jwt.js";
import { sendMail } from "../middleware/mail.js";

const prisma = new PrismaClient();

/**
 * Generate unique 12-character ref code (e.g. SC-ABC123XYZ9)
 */
function generateRefCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'SC-';
  for (let i = 0; i < 9; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Generate secure one-time password setup token
 */
export function generatePasswordToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Register new user - creates user with 'pending' status and unique ref_code
 * POST /api/users/register
 * @param {Object} payload - { name, email, reg_no, year, domain }
 * @returns {Object} - { id, email, ref_code, status }
 */
export async function register(payload) {
  // Check if email already exists
  const existing = await prisma.user.findUnique({ where: { email: payload.email } });
  if (existing) {
    throw new Error("Email already registered");
  }

  // Generate unique ref_code
  let ref_code;
  let attempts = 0;
  while (attempts < 10) {
    ref_code = generateRefCode();
    const existingCode = await prisma.user.findUnique({ where: { ref_code } });
    if (!existingCode) break;
    attempts++;
  }
  
  if (attempts === 10) {
    throw new Error("Unable to generate unique reference code");
  }

  // Create user with pending status
  const user = await prisma.user.create({
    data: { 
      ...payload, 
      ref_code, 
      status: "pending" 
    }
  });

  // TODO: Optionally notify admin by email
  // await sendMail(
  //   process.env.ADMIN_EMAIL,
  //   "New User Registration",
  //   `New user ${user.name} (${user.email}) registered with ref code: ${user.ref_code}`
  // );

  return { 
    id: user.id, 
    email: user.email, 
    ref_code: user.ref_code, 
    status: user.status 
  };
}

/**
 * Set password using one-time token (sent via email after admin approval)
 * POST /api/users/set-password
 * @param {string} token - One-time password setup token
 * @param {string} password - New password
 * @returns {boolean}
 */
export async function setPassword(token, password) {
  // Find user by token
  const user = await prisma.user.findUnique({ 
    where: { set_password_token: token } 
  });

  if (!user) {
    throw new Error("Invalid or expired token");
  }

  // Check if token is expired
  if (!user.set_password_expires || user.set_password_expires < new Date()) {
    throw new Error("Token has expired");
  }

  // Check if user is approved
  if (user.status !== "approved") {
    throw new Error("User account not approved");
  }

  // Hash password
  const hash = await bcrypt.hash(password, 12);

  // Update user: set password, clear token
  await prisma.user.update({
    where: { id: user.id },
    data: { 
      password_hash: hash,
      set_password_token: null,
      set_password_expires: null
    }
  });

  return true;
}

/**
 * Login with email and password
 * POST /api/auth/login
 * @param {string} email
 * @param {string} password
 * @returns {Object} - { token, user }
 */
export async function login(email, password) {
  // Find user
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  // Check if approved
  if (user.status !== "approved") {
    throw new Error("Account not approved. Please wait for admin approval.");
  }

  // Check if password is set
  if (!user.password_hash) {
    throw new Error("Password not set. Please check your email for the password setup link.");
  }

  // Verify password
  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  // Generate JWT
  const token = signJwt({ 
    id: user.id, 
    role: user.role, 
    email: user.email 
  });

  return { 
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  };
}

/**
 * Get user by ID
 * @param {string} userId
 * @returns {Object} - User without sensitive fields
 */
export async function getUserById(userId) {
  const user = await prisma.user.findUnique({ 
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      reg_no: true,
      year: true,
      domain: true,
      role: true,
      status: true,
      created_at: true
    }
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
=======
import { PrismaClient } from "@prisma/client";
import { signJwt } from "../utils/jwt.js";
import { sendMail } from "../utils/mail.js";
const prisma = new PrismaClient();

function generateRefCode() {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

export async function register(payload) {
  // payload: { name, email, reg_no, year, domain }
  const ref_code = generateRefCode();
  const user = await prisma.user.create({
    data: { ...payload, ref_code, status: "pending" }
  });
  // TODO: notify admin by email (sendMail)
  return { id: user.id, email: user.email, ref_code: user.ref_code, status: user.status };
}

export async function setPassword(ref_code, password) {
  const user = await prisma.user.findUnique({ where: { ref_code } });
  if (!user) throw new Error("Invalid reference code");
  const hash = await bcrypt.hash(password, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password_hash: hash }
  });
  return true;
}

export async function login(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.status !== "approved") throw new Error("Invalid credentials or not approved");
  const ok = user.password_hash ? await bcrypt.compare(password, user.password_hash) : false;
  if (!ok) throw new Error("Invalid credentials");
  const token = signJwt({ id: user.id, role: user.role, email: user.email });
  return token;
>>>>>>> 5f9e4a115489d823fb1bd7fd4a91f6fbed6c587b
}
