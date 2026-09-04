import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import dotenv from "dotenv";
import type { AuthRequest } from "../middlewares/authMiddleware.js";

dotenv.config();

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_jwt_key_change_me_in_production";

export const login = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { username, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(401).json({ error: "Invalid username or password" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: "Invalid username or password" });

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "24h" });
    res.json({ message: "Login successful", token, user: { id: user.id, username: user.username } });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const registerAdmin = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Username and password are required" });
  try {
    const count = await prisma.user.count();
    if (count > 0) return res.status(403).json({ error: "Admin user already exists" });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { username, passwordHash }, select: { id: true, username: true } });
    res.status(201).json({ message: "Admin registered successfully", user });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, username: true, createdAt: true },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};
