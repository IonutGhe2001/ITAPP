import express from "express";
import {
  getEchipamente,
  createEchipament,
  updateEchipament,
  deleteEchipament,
} from "../controllers/echipamenteController";

const router = express.Router();

router.get("/", getEchipamente);
router.post("/", createEchipament);
router.put("/:id", updateEchipament);
router.delete("/:id", deleteEchipament);

export default router;
