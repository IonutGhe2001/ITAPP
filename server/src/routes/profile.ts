import express from "express";
import * as controller from "../controllers/profileController";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.use(authenticate);

router.get("/metrics", controller.getUserMetrics);
router.get("/activity", controller.getUserActivity);
router.get("/sessions", controller.getUserSessions);

export default router;