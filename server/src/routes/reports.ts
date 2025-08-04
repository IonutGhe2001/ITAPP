import express from "express";
import * as controller from "../controllers/reportController";
import { authenticate, authorizeRoles } from "../middlewares/authMiddleware";

const router = express.Router();

router.use(authenticate);
router.get("/equipment", authorizeRoles("admin"), controller.equipmentReport);
router.get("/onboarding", authorizeRoles("admin"), controller.onboardingReport);

export default router;
