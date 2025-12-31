import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function signJwt(payload, expiresIn = "7d") {
	if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not set in environment");
	return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

export function verifyJwt(token) {
	if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not set in environment");
	return jwt.verify(token, process.env.JWT_SECRET);
}

// In-memory token revocation list (suitable for tests / single-process servers)
// For production use a persistent store (Redis, DB) with TTL equal to token expiry
export const revokedTokens = new Set();

export function revokeJwt(token) {
  if (!token) return;
  revokedTokens.add(token);
}

export function isRevoked(token) {
  return revokedTokens.has(token);
}
