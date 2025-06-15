import { Request, Response } from "express";

export const me = (req: Request, res: Response) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    const { id, email } = req.user as any;
    res.json({ id, email });
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
};
