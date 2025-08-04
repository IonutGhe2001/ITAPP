import express from "express";
import * as controller from "../controllers/onboardingController";
import { validateRequest } from "../middlewares/validateRequest";
import { createOnboardingSchema } from "../validators/onboarding.validator";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.use(authenticate);

router.get("/packages/:department", controller.getPackages);
router.post(
  "/",
  validateRequest(createOnboardingSchema),
  controller.createOnboarding
);

export default router;
