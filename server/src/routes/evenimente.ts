import express from "express";
import * as controller from "../controllers/evenimenteController";
import { validateRequest } from "../middlewares/validateRequest";
import { createEvenimentSchema, updateEvenimentSchema } from "../validators/eveniment.validator";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.use(authenticate);

router.get("/", controller.getEvenimente);
router.post("/", validateRequest(createEvenimentSchema), controller.createEveniment);
router.patch("/:id", validateRequest(updateEvenimentSchema), controller.updateEveniment);
router.delete("/:id", controller.deleteEveniment);

export default router;
