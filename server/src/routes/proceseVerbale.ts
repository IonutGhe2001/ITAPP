import { Router } from "express";
import { creareProcesVerbal } from "../controllers/procesVerbalController";

const router = Router();

router.post("/", creareProcesVerbal);

export default router;