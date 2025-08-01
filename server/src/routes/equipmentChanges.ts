import express from "express";
import * as controller from "../controllers/equipmentChangesController";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.use(authenticate);

router.get("/:angajatId", controller.getEquipmentChanges);

export default router;