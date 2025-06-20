import { Router } from "express";
import { getFavorites } from "../controllers/user/getFavorites";
import { addToFavorites } from "../controllers/user/addToFavorites";
import { removeFromFavorites } from "../controllers/user/removeFromFavorites";
import { registerUser } from "../controllers/user/registerUser";
import { loginUser } from "../controllers/user/loginUser";
import { me } from "../controllers/user/me";
import { logoutUser } from "../controllers/user/logoutUser";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", me);
router.post("/logout", logoutUser);

router.get("/:userId/favorites", getFavorites);
router.post("/:userId/favorites", addToFavorites);
router.delete("/:userId/favorites/:movieId", removeFromFavorites);

export default router;
