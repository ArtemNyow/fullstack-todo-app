import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

interface JwtPayload {
  userId: number;
  email: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        message: "Authorization header is required",
      });
      return;
    }

    const [type, token] = authHeader.split(" ");

    if (type !== "Bearer" || !token) {
      res.status(401).json({
        message: "Invalid authorization format",
      });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    req.user = decoded;

    next();
  } catch {
    res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
