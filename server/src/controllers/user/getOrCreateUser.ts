import { Request, Response } from "express";
import { drizzleDb } from "../../db";
import { users } from "../../schema";
import { eq } from "drizzle-orm";

// Create or fetch a user by email
export const getOrCreateUser = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    // Check if user exists
    const existing = await drizzleDb.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing.length > 0) {
      const user = existing[0];
      return res.json({ userId: user.id, email: user.email });
    }

    // Create new user
    const result = await drizzleDb.insert(users).values({ email }).returning();
    const newUser = result[0];
    return res.json({ userId: newUser.id, email: newUser.email });
  } catch (error) {
    console.error("Error in getOrCreateUser:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

