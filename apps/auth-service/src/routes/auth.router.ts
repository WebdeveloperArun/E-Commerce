import { Router } from "express";
import express from "express";
import {
  forgotPassword,
  getUser,
  loginUser,
  refreshToken,
  resetPassword,
  userRegistration,
  verifyForgotPassword,
  verifyUser,
} from "../controller/auth.controller";
import isAuthenticated from "@packages/middleware/isAuthenticated";

const router: Router = express.Router();

router.post("/user-registration", userRegistration);
router.post("/verify-user", verifyUser);
router.post("/login-user", loginUser);
router.post("/refresh-token-user", refreshToken);
router.get("/logged-in-user", isAuthenticated, getUser);
router.post("/forgot-password-user", forgotPassword);
router.post("/verify-forgot-password-user", verifyForgotPassword);
router.post("/reset-password-user", resetPassword);

export default router;
