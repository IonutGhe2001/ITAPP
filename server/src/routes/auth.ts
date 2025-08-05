import express from "express";
import {
  login,
  getMe,
  register,
  updateMe,
  logout,
} from "../controllers/authController";
import { validateRequest } from "../middlewares/validateRequest";
import { registerSchema } from "../validators/auth.validator";
import { authenticate, authorizeRoles } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/login", login);
router.get("/me", authenticate, getMe);
router.patch("/me", authenticate, updateMe);
router.post("/logout", authenticate, logout);
router.post(
  "/register",
  authenticate,
  authorizeRoles("admin"),
  validateRequest(registerSchema),
  register
);

export default router;
