import express, { Router } from "express";
import {
  registerUser,
  loginUser,
  googleLogin,
  logoutUser,
} from "../controllers/authController";
import upload from "../middleware/upload";

const router: Router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);
router.post("/logout", logoutUser);

export default router;
