import { Request, Response } from "express";

// --- In-memory user & favorites store (for demo purposes) ---
const users: { [email: string]: { userId: string; email: string } } = {};
export const userFavorites: { [userId: string]: any[] } = {};

function getOrCreateUserHelper(email: string) {
  if (!users[email]) {
    const userId = Math.random().toString(36).slice(2) + Date.now();
    users[email] = { userId, email };
    userFavorites[userId] = [];
  }
  return users[email];
}

// --- User and Favorites Endpoints ---
// Create or fetch a user by email
export const getOrCreateUser = (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });
  const user = getOrCreateUserHelper(email);
  res.json({ userId: user.userId, email: user.email });
};
