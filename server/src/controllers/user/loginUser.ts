import { Request, Response, NextFunction } from "express";
import passport from "../../auth/passport";

export const loginUser = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("local", (err: any, user: any, info: any) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: info?.message || "Invalid credentials" });
    req.logIn(user, (err) => {
      if (err) return next(err);
      // Only return safe user info
      res.json({ id: user.id, email: user.email });
    });
  })(req, res, next);
};
