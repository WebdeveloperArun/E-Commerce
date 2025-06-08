import { Router } from "express";
import express from "express";
import {
  connectRazorpay,
  createShop,
  forgotPassword,
  getSeller,
  getUser,
  loginSeller,
  loginUser,
  refreshToken,
  registerSeller,
  resetPassword,
  userRegistration,
  verifyForgotPassword,
  verifySeller,
  verifyUser,
} from "../controller/auth.controller";
import isAuthenticated from "@packages/middleware/isAuthenticated";
import { isSeller, isUser } from "@packages/middleware/authorizeRoles";

const router: Router = express.Router();

router.post("/user-registration", userRegistration);
router.post("/verify-user", verifyUser);
router.post("/login-user", loginUser);
router.post("/refresh-token-user", refreshToken);
router.get("/logged-in-user", isAuthenticated, isUser, getUser);
router.post("/forgot-password-user", forgotPassword);
router.post("/verify-forgot-password-user", verifyForgotPassword);
router.post("/reset-password-user", resetPassword);
router.post("/seller-registration", registerSeller);
router.post("/verify-seller", verifySeller);
router.post("/create-shop", createShop);
router.post("/connect-razorpay", connectRazorpay);
router.post("/login-seller", loginSeller);
router.get("/logged-in-seller", isAuthenticated, isSeller, getSeller);

export default router;
