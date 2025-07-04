import { Router } from "express";
import { getEvenimente, createEveniment, deleteEveniment, updateEveniment } from "../controllers/evenimenteController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", authenticate, getEvenimente);
router.post("/", authenticate, createEveniment);
router.delete("/:id", authenticate, deleteEveniment);
router.patch("/:id", authenticate, updateEveniment);

export default router;
