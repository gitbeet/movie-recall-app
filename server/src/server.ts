import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import passport from "./auth/passport";
import movieRouter from "./routes/movie";
import userRouter from "./routes/user";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Allow credentials and set frontend origin for local dev
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
app.use(express.json()); // Middleware to parse JSON bodies

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // set to true if using HTTPS
      sameSite: "lax", // for local dev; use 'none' with secure: true for HTTPS cross-origin
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/user", userRouter);
app.use("/api/movie", movieRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
