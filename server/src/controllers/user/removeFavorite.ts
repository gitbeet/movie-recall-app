import { Request, Response } from "express";
import { userFavorites } from "../user/getOrCreateUser";

export const removeFavorite = (req: Request, res: Response) => {
  const { userId, movieId } = req.params;
  if (!userFavorites[userId]) return res.json({ favorites: [] });
  userFavorites[userId] = userFavorites[userId].filter(
    (m: any) => String(m.id) !== String(movieId)
  );
  res.json({ favorites: userFavorites[userId] });
};
