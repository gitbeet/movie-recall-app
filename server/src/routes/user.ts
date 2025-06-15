import { Router } from "express";
import { getOrCreateUser } from "../controllers/user/getOrCreateUser";
import { getFavorites } from "../controllers/user/getFavorites";
import { addToFavorites } from "../controllers/user/addToFavorites";
import { removeFromFavorites } from "../controllers/user/removeFromFavorites";

const router = Router();

router.post("/create", getOrCreateUser);

router.get("/:userId/favorites", getFavorites);
router.post("/:userId/favorites", addToFavorites);
router.delete("/:userId/favorites/:movieId", removeFromFavorites);

export default router;
