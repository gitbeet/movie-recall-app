import { Request, Response } from "express";
import { drizzleDb } from "../../db";
import { users } from "../../schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

export const registerUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }
  try {
    // Check if user already exists
    const existing = await drizzleDb.select().from(users).where(eq(users.email, email));
    if (existing.length > 0) {
      return res.status(409).json({ error: "User already exists." });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const [user] = await drizzleDb.insert(users).values({ email, passwordHash }).returning();
    res.status(201).json({ id: user.id, email: user.email });
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
};
