import express from "express";
import * as controller from "../controllers/echipamenteController";
import { validateRequest } from "../middlewares/validateRequest";
import { createEchipamentSchema, updateEchipamentSchema } from "../validators/echipament.validator";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.use(authenticate);

router.get("/", controller.getEchipamente);
router.post("/", validateRequest(createEchipamentSchema), controller.createEchipament);
router.put("/:id", validateRequest(updateEchipamentSchema), controller.updateEchipament);
router.delete("/:id", controller.deleteEchipament);

export default router;