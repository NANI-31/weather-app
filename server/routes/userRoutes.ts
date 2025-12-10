import express, { Router } from "express";
import {
  addFavorite,
  removeFavorite,
  getFavorites,
  updateUserProfile,
  deleteAllFavorites,
  deleteAccount,
  changePassword,
  uploadProfilePicture,
} from "../controllers/userController";

import { protect } from "../middleware/authMiddleware";
import upload from "../middleware/upload";

const router: Router = express.Router();

router.post("/add-favorite", protect, addFavorite);
router.post("/remove-favorite", protect, removeFavorite);
router.get("/favorites", protect, getFavorites);
router.put("/update-profile", protect, updateUserProfile);
router.delete("/delete-favorites", protect, deleteAllFavorites);
router.delete("/delete-account", protect, deleteAccount);
router.put("/change-password", protect, changePassword);

// Include upload middleware
router.post(
  "/upload-profile-picture",
  protect,
  upload.single("image"),
  uploadProfilePicture
);

export default router;
