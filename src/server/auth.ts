import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AdminAuthRequest extends Request {
  admin?: {
    id: string;
    email: string;
    role: string;
  };
}

export function generateToken(payload: object): string {
  const secret = process.env.JWT_SECRET || "fallback_jwt_secret_key_12345";
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

export function verifyAdminToken(req: AdminAuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET || "fallback_jwt_secret_key_12345";

  try {
    const decoded = jwt.verify(token, secret) as any;
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token." });
  }
}
