import express from "express";
import { login, getMe, register } from "../controllers/authController";
import { validateRequest } from "../middlewares/validateRequest";
import { loginSchema, registerSchema } from "../validators/auth.validator";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/login", validateRequest(loginSchema), login);
router.get("/me", authenticate, getMe);
router.post("/register", validateRequest(registerSchema), register);


export default router;