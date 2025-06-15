import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { drizzleDb } from "../db";
import { users } from "../schema";
import { eq } from "drizzle-orm";

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        const userArr = await drizzleDb.select().from(users).where(eq(users.email, email));
        const user = userArr[0];
        if (!user) {
          return done(null, false, { message: "Incorrect email or password." });
        }
        if (!user.passwordHash) {
          return done(null, false, { message: "No password set for this user." });
        }
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
          return done(null, false, { message: "Incorrect email or password." });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const userArr = await drizzleDb.select().from(users).where(eq(users.id, id));
    const user = userArr[0];
    if (!user) return done(null, false);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
