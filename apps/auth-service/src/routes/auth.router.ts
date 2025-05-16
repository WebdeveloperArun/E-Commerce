import { Router } from "express";
import express from "express";
import { userRegistration } from "../controller/auth.controller";

const router: Router = express.Router();

router.post("/user-registration", userRegistration);

export default router;
