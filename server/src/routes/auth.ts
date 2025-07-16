import express from "express";
import { login, getMe } from "../controllers/authController";
import { validateRequest } from "../middlewares/validateRequest";
import { loginSchema } from "../validators/auth.validator";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/login", validateRequest(loginSchema), login);
router.get("/me", authenticate, getMe);

export default router;