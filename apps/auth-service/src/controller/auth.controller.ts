import { NextFunction, Request, Response } from "express";
import {
  checkOtpRestrictions,
  handleForgotPassword,
  sendOtp,
  trackOtpRequests,
  validateRegistrationData,
  varifyForgotPasswordOtp,
  verifyOtp,
} from "../utils/auth.helper";
import prisma from "@packages/libs/prisma";
import { AuthenticationError, ValidationError } from "@packages/error-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { setCookie } from "../utils/cookies/setCookie";
import axios from "axios";
import dotenv from "dotenv";
import { sign } from "crypto";

dotenv.config();

// Register a new user
export const userRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validateRegistrationData(req.body, "user");
    const { name, email } = req.body;

    const existingUser = await prisma.users.findUnique({ where: { email } });

    if (existingUser) {
      return next(new ValidationError("User Already exists with this email!"));
    }

    await checkOtpRestrictions(email, next);
    await trackOtpRequests(email, next);
    await sendOtp(name, email, "user-activation-mail");

    res
      .status(200)
      .send({ message: "Otp sent to email. Please varify your account." });
  } catch (error) {
    return next(error);
  }
};

// Verify user
export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp, password, name } = req.body;

    if (!email || !otp || !password || !name) {
      return next(new ValidationError("All fields are required!"));
    }

    const existingUser = await prisma.users.findUnique({ where: { email } });

    if (existingUser) {
      return next(new ValidationError("User Already exists with this email!"));
    }

    await verifyOtp(email, otp, next);

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res
      .status(201)
      .json({ success: true, message: "Account verified successfully." });
  } catch (error) {
    return next(error);
  }
};

// Login user
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ValidationError("Email and password are required!"));
    }

    const user = await prisma.users.findUnique({ where: { email } });

    if (!user) {
      return next(new AuthenticationError("User not found!"));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password!);

    if (!isPasswordValid) {
      return next(new AuthenticationError("Invalid password!"));
    }

    // generate access and varification token
    const accessToken = jwt.sign(
      { id: user.id, role: "user" },
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: "15m",
      }
    );
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET as string,
      {
        expiresIn: "7d",
      }
    );

    // store the refresh and access token in an httpOnly secure cookie
    setCookie(res, "refresh_token", refreshToken);
    setCookie(res, "access_token", accessToken);

    res.status(200).json({
      message: "User logged in successfully.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// Refresh token user
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken =
      req.cookies["refresh_token"] ||
      req.cookies["seller-refresh-token"] ||
      req.headers.authorization?.split(" ")[1];

    if (!refreshToken) {
      return next(new ValidationError("Unauthorized! No refresh token."));
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as { id: string; role?: string }; // role might not be present in refresh token

    if (!decoded || !decoded.id) {
      return next(new AuthenticationError("Forbidden! Invalid refresh token."));
    }

    let account;
    if (decoded.role === "user") {
      account = await prisma.users.findUnique({ where: { id: decoded.id } });
    } else if (decoded.role === "seller") {
      account = await prisma.sellers.findUnique({
        where: { id: decoded.id },
        include: { shop: true },
      });
    }

    if (!account) {
      return next(new AuthenticationError("Forbidden! User/Seller not found!"));
    }

    const newAccessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: "15m",
      }
    );

    if (decoded.role === "user") {
      setCookie(res, "access_token", newAccessToken);
    } else if (decoded.role === "seller") {
      setCookie(res, "seller-access-token", newAccessToken);
    }

    res.status(201).json({ success: true });
  } catch (error) {
    return next(error);
  }
};

// Get logged in user
export const getUser = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    res.status(201).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// User Forgot Password
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await handleForgotPassword(req, res, next, "user");
};

// Verify user forgot password
export const verifyForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await varifyForgotPasswordOtp(req, res, next);
};

// Reset user Password
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return next(new ValidationError("Email and password are required!"));
    }

    const user = await prisma.users.findUnique({ where: { email } });

    if (!user) return next(new ValidationError("User not found!"));

    const samePassword = await bcrypt.compare(newPassword, user.password!);

    if (samePassword)
      return next(
        new ValidationError("New password cannot be same as the old password!")
      );

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.users.update({
      where: { email },
      data: { password: hashedPassword },
    });

    res.status(200).json({ message: "Password updated Successfully!" });
  } catch (error) {
    next(error);
  }
};

// Register a new Seller
export const registerSeller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validateRegistrationData(req.body, "seller");
    const { name, email } = req.body;

    const existingSeller = await prisma.sellers.findUnique({
      where: { email },
    });

    if (existingSeller) {
      return next(
        new ValidationError("Seller Already exists with this email!")
      );
    }

    await checkOtpRestrictions(email, next);
    await trackOtpRequests(email, next);
    await sendOtp(name, email, "seller-activation-mail");

    res
      .status(200)
      .send({ message: "Otp sent to email. Please varify your account." });
  } catch (error) {
    return next(error);
  }
};

// Verify seller
export const verifySeller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp, password, name, phone_number, country } = req.body;

    if (!email || !otp || !password || !name || !phone_number || !country) {
      return next(new ValidationError("All fields are required!"));
    }

    const existingSeller = await prisma.sellers.findUnique({
      where: { email },
    });

    if (existingSeller) {
      return next(
        new ValidationError("Seller Already exists with this email!")
      );
    }

    await verifyOtp(email, otp, next);

    const hashedPassword = await bcrypt.hash(password, 10);

    const seller = await prisma.sellers.create({
      data: {
        name,
        email,
        password: hashedPassword,
        country,
        phone_number,
      },
    });

    res.status(201).json({
      success: true,
      message: "Seller registered successfully.",
      seller,
    });
  } catch (error) {
    return next(error);
  }
};

// Create a new shop
export const createShop = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      name,
      bio,
      business_name,
      business_type,
      address,
      opening_hours,
      website,
      sellerId,
    } = req.body;

    if (
      !name ||
      !bio ||
      !business_name ||
      !business_type ||
      !address ||
      !opening_hours ||
      !sellerId
    ) {
      return next(new ValidationError("All fields are required!"));
    }

    const shopData: any = {
      name,
      bio,
      business_name,
      business_type,
      address,
      opening_hours,
      sellerId,
    };

    if (website && website.trim() !== "") {
      shopData.website = website;
    }

    const shop = await prisma.shops.create({
      data: shopData,
    });

    res.status(201).json({ success: true, shop });
  } catch (error) {
    return next(error);
  }
};

// Connect razorpay
export const connectRazorpay = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sellerId } = req.body;

    if (!sellerId) {
      return next(new ValidationError("Missing required fields"));
    }

    const seller = await prisma.sellers.findUnique({
      where: { id: sellerId },
      include: { shop: true },
    });

    if (!seller) return next(new ValidationError("Seller not found!"));
    if (!seller.shop) return next(new ValidationError("Shop not found!"));

    const { email, phone_number, name } = seller;

    const formattedPhone = phone_number
      ? String(phone_number).replace(/\D/g, "").slice(0, 10)
      : "9876543210";

    const payload = {
      merchant_id: Date.now().toString(),
      merchant_email: email,
      merchant_name: name,
      poc_phone: formattedPhone,
      merchant_site_url: seller.shop.website,
      business_details: {
        business_legal_name: seller.shop.business_name,
        business_type: seller.shop.business_type,
        business_model: "Both",
      },
      signatory_details: {
        signatory_name: name,
      },
    };

    console.log("payload", payload);

    const razorpayAccount = await axios.post(
      "https://api-sandbox.cashfree.com/partners/merchants",
      payload,
      {
        headers: {
          "x-partner-apikey": `${process.env.CASHFREE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!razorpayAccount)
      return next(
        new AuthenticationError("Cannot connect account with cashfree!")
      );

    console.log("razorpayAccount", razorpayAccount.data);

    await prisma.sellers.update({
      where: { id: sellerId },
      data: { cashfreeId: razorpayAccount.data.merchant_id },
    });

    const createOnboardingUrl = await axios.post(
      `https://api-sandbox.cashfree.com/partners/merchants/${razorpayAccount.data.merchant_id}/onboarding_link/standard`,
      {
        type: "account_onboarding",
        return_url: "http://localhost:3000/success",
      },
      {
        headers: {
          "x-partner-apikey": `${process.env.CASHFREE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!createOnboardingUrl)
      return next(
        new AuthenticationError("Cannot connect account with cashfree!")
      );

    console.log("createOnboardingUrl", createOnboardingUrl.data);

    res
      .status(201)
      .json({ redirect_url: createOnboardingUrl.data.onboarding_link });
  } catch (error: any) {
    console.error(
      "Razorpay connection error:",
      error.response?.data || error.message
    );
    // console.log(error.response);

    return next(error.response);
  }
};

// Login seller
export const loginSeller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ValidationError("Email and password are required!"));
    }

    const seller = await prisma.sellers.findUnique({ where: { email } });

    if (!seller) {
      return next(new ValidationError("Seller not found!"));
    }

    const isMatch = await bcrypt.compare(password, seller.password!);

    if (!isMatch) {
      return next(new ValidationError("Invalid password!"));
    }

    // generate access and varification token
    const accessToken = jwt.sign(
      { id: seller.id, role: "seller" },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { id: seller.id, role: "seller" },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "7d" }
    );

    setCookie(res, "seller-access-token", accessToken);
    setCookie(res, "seller-refresh-token", refreshToken);

    res.status(201).json({
      success: true,
      message: "Seller logged in successfully.",
      seller: { id: seller.id, email: seller.email, name: seller.name },
    });
  } catch (error) {
    return next(error);
  }
};

// Get seller
export const getSeller = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const seller = req.seller;

    res.status(200).json({ success: true, seller });
  } catch (error) {
    return next(error);
  }
};
