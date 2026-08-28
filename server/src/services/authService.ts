import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
import { JWT_SECRET } from "../config/env.js";

export const registerUser = async (email: string, password: string) => {
  const normalizedEmail = email.trim().toLowerCase();

  validateCredentials(normalizedEmail, password);

  const existingUser = await User.findOne({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email: normalizedEmail,
    password: hashedPassword,
  });

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
    },
  };
};
export const loginUser = async (email: string, password: string) => {
  const normalizedEmail = email.trim().toLowerCase();

  validateCredentials(normalizedEmail, password);

  const user = await User.findOne({
    where: { email: normalizedEmail },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
    },
  };
};

const validateCredentials = (email: string, password: string) => {
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    throw new Error("A valid email is required");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }
};
