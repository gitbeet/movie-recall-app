import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import movieRouter from "./routes/movie";
import userRouter from "./routes/user";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

app.use("/api/user", userRouter);
app.use("/api/movie", movieRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
