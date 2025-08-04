import express from "express";
import {
  creareProcesVerbal,
  creareProcesVerbalDinSchimbari,
} from "../controllers/procesVerbalController";
import { validateRequest } from "../middlewares/validateRequest";
import {
  createProcesVerbalSchema,
  procesVerbalFromChangesSchema,
} from "../validators/procesVerbal.validator";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.post(
  "/",
  authenticate,
  validateRequest(createProcesVerbalSchema),
  creareProcesVerbal
);

router.post(
  "/from-changes",
  authenticate,
  validateRequest(procesVerbalFromChangesSchema),
  creareProcesVerbalDinSchimbari
);

export default router;
