import { Request, Response } from "express";

export const logoutUser = (req: Request, res: Response) => {
  req.logout(function(err) {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    req.session?.destroy(() => {
      res.clearCookie('connect.sid');
      res.json({ message: "Logged out" });
    });
  });
};
