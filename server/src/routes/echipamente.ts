import express from "express";
import {
  getEchipamente,
  createEchipament,
  updateEchipament,
  deleteEchipament
} from "../controllers/echipamenteController";

import { authenticate, authorizeRoles } from "../middlewares/authMiddleware";

const router = express.Router();

// Protejăm toate rutele
router.get("/", authenticate, getEchipamente);
router.post("/", authenticate, authorizeRoles("admin"), createEchipament);
router.put("/:id", authenticate, updateEchipament);
router.delete("/:id", authenticate, authorizeRoles("admin"), deleteEchipament);

export default router;
