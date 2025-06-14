import { Request, Response } from "express";
import { userFavorites } from "../user/getOrCreateUser";

export const getFavorites = (req: Request, res: Response) => {
  const { userId } = req.params;
  const favorites = userFavorites[userId] || [];
  res.json({ favorites });
};
