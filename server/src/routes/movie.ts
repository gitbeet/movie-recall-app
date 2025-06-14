import { Router } from "express";
import { getMovieData } from "../controllers/movie/getMovie";
import { getMovies } from "../controllers/movie/getMovies";

const router = Router();

router.post("/find", getMovies);
router.get("/:id", getMovieData);

export default router;
