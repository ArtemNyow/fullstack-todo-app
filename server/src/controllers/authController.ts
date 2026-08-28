import { Request, Response } from "express";
import { loginUser, registerUser } from "../services/authService.js";

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
