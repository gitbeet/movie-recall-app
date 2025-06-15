import { Request, Response } from "express";
import { drizzleDb } from "../../db";
import { favorites } from "../../schema";
import { eq } from "drizzle-orm";

export const getFavorites = async (req: Request, res: Response) => {
  const { userId } = req.params;
  if (!userId) return res.status(400).json({ error: "userId is required" });

  try {
    const favoritesList = await drizzleDb
      .select()
      .from(favorites)
      .where(eq(favorites.userId, Number(userId)));
    res.json({ favorites: favoritesList });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
