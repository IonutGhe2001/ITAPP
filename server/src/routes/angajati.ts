import express from "express";
import {
  getAngajati,
  createAngajat,
  updateAngajat,
  deleteAngajat
} from "../controllers/angajatiController";
import { authenticate, authorizeRoles } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", authenticate, getAngajati);
router.post("/", authenticate, authorizeRoles("admin"), createAngajat);
router.put("/:id", authenticate, updateAngajat);
router.delete("/:id", authenticate, authorizeRoles("admin"), deleteAngajat);

export default router;
