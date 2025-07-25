import express from "express";
import { login, getMe, register, updateMe } from "../controllers/authController";
import { validateRequest } from "../middlewares/validateRequest";
import { loginSchema, registerSchema } from "../validators/auth.validator";
import { authenticate, authorizeRoles } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/login", validateRequest(loginSchema), login);
router.get("/me", authenticate, getMe);
router.patch("/me", authenticate, updateMe); 
router.post(
  "/register",
  authenticate,
  authorizeRoles("admin"),
  validateRequest(registerSchema),
  register
);

export default router;