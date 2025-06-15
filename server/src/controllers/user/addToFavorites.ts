import { Request, Response } from "express";
import { drizzleDb } from "../../db";
import { favorites } from "../../schema";

export const addToFavorites = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const movie = req.body;
  if (!userId || !movie || !movie.id)
    return res.status(400).json({
      error: `userId and movie object with id required: ${userId}, ${movie}`,
    });

  try {
    await drizzleDb.insert(favorites).values({
      userId: Number(userId),
      movieId: String(movie.id),
      title: movie.title,
      posterUrl: movie.posterUrl,
      releaseDate: movie.releaseYear ? String(movie.releaseYear) : undefined,
      description: movie.description,
    });
    res.json({ success: true });
  } catch (error) {
    console.error("Error adding favorite:", error);
    res.status(500).json({ error: `Internal server error: ${error}` });
  }
};
