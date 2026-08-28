import { Request, Response } from "express";
import { loginUser, registerUser } from "../services/authService.js";
import User from "../models/User.js";
import { AuthRequest } from "../middleware/authMiddleware.js";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await registerUser(email, password);

    res.status(201).json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    res.status(400).json({
      message,
    });
  }
};
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await loginUser(email, password);

    res.status(200).json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    res.status(401).json({
      message,
    });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const user = await User.findByPk(req.user.userId, {
      attributes: ["id", "email"],
    });

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      user,
    });
  } catch {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
