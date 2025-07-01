import express from "express";
import {
  getAngajati,
  createAngajat,
  updateAngajat,
  deleteAngajat,
} from "../controllers/angajatiController";

const router = express.Router();

router.get("/", getAngajati);
router.post("/", createAngajat);
router.put("/:id", updateAngajat);
router.delete("/:id", deleteAngajat);

export default router;
