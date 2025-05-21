import { Router } from "express";
import express from "express";
import {
  forgotPassword,
  loginUser,
  resetPassword,
  userRegistration,
  verifyForgotPassword,
  verifyUser,
} from "../controller/auth.controller";

const router: Router = express.Router();

router.post("/user-registration", userRegistration);
router.post("/verify-user", verifyUser);
router.post("/login-user", loginUser);
router.post("/forgot-password-user", forgotPassword);
router.post("/verify-forgot-password-user", verifyForgotPassword);
router.post("/reset-password-user", resetPassword);

export default router;
