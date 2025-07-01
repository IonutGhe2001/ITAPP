import { Router } from "express";
import { login } from "../controllers/authController";

const router = Router();

// Rute publice
router.post("/login", login);

export default router;
