import express from "express";
import { signup, login, forgotUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot", forgotUser);

export default router;
