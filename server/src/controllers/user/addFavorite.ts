import { Request, Response } from "express";
import { userFavorites } from "../user/getOrCreateUser";

export const addFavorite = (req: Request, res: Response) => {
  const { userId } = req.params;
  const movie = req.body;
  if (!movie || !movie.id)
    return res.status(400).json({ error: "Movie object with id required" });
  if (!userFavorites[userId]) userFavorites[userId] = [];
  // Avoid duplicates
  if (!userFavorites[userId].some((m: any) => m.id === movie.id)) {
    userFavorites[userId].push(movie);
  }
  res.json({ favorites: userFavorites[userId] });
};
