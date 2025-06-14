import { Router } from "express";
import { getOrCreateUser } from "../controllers/user/getOrCreateUser";
import { getFavorites } from "../controllers/user/getFavorites";
import { addFavorite } from "../controllers/user/addFavorite";
import { removeFavorite } from "../controllers/user/removeFavorite";

const router = Router();

router.post("/create", getOrCreateUser);
router.get("/:userId/favorites", getFavorites);
router.post("/:userId/favorites", addFavorite);
router.delete("/:userId/favorites/:movieId", removeFavorite);

export default router;
