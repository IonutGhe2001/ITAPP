import { Router } from "express";
import { getMe, login } from "../controllers/authController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

// Rute publice
router.post("/login", login);
router.get("/me", authenticate, getMe);

export default router;
