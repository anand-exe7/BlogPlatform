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
