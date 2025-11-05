import express from "express";
import * as controller from "../controllers/dashboardController";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.use(authenticate);

router.get("/stats/overview", controller.getOverviewStats);
router.get("/stats/equipment-status", controller.getEquipmentStatusTimeline);
router.get("/alerts", controller.getAlerts);
router.get("/pv-queue", controller.getPvQueue);
router.get("/activity", controller.getActivity);

export default router;