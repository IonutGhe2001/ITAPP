import express from "express";
import * as controller from "../controllers/angajatiController";
import { validateRequest } from "../middlewares/validateRequest";
import { createAngajatSchema, updateAngajatSchema } from "../validators/angajat.validator";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.use(authenticate);

router.get("/", controller.getAngajati);
router.post("/", validateRequest(createAngajatSchema), controller.createAngajat);
router.put("/:id", validateRequest(updateAngajatSchema), controller.updateAngajat);
router.delete("/:id", controller.deleteAngajat);

export default router;