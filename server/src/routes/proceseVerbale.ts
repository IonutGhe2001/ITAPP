import express from "express";
import { creareProcesVerbal } from "../controllers/procesVerbalController";
import { validateRequest } from "../middlewares/validateRequest";
import { createProcesVerbalSchema } from "../validators/procesVerbal.validator";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", authenticate, validateRequest(createProcesVerbalSchema), creareProcesVerbal);

export default router;