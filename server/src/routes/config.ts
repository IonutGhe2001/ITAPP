import express from "express";
import { env } from "../config";

const router = express.Router();

router.get("/", (_req, res) => {
  res.json({ pvGenerationMode: env.PV_GENERATION_MODE });
});

export default router;
