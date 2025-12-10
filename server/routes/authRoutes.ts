import express, { Router } from "express";
import {
  registerUser,
  loginUser,
  googleLogin,
  logoutUser,
  forgotPassword,
  resetPassword,
} from "../controllers/authController";

const router: Router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);
router.post("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
