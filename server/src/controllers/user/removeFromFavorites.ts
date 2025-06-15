import { Request, Response } from "express";
import { drizzleDb } from "../../db";
import { favorites } from "../../schema";
import { and, eq } from "drizzle-orm";

export const removeFromFavorites = async (req: Request, res: Response) => {
  const { userId, movieId } = req.params;
  if (!userId || !movieId)
    return res.status(400).json({ error: "userId and movieId are required" });

  try {
    await drizzleDb
      .delete(favorites)
      .where(
        and(
          eq(favorites.userId, Number(userId)),
          eq(favorites.movieId, String(movieId))
        )
      );
    res.json({ success: true });
  } catch (error) {
    console.error("Error removing favorite:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
