import express from "express";

const router = express.Router();

router.get("/", (_req, res) => {
  const mode = process.env.PV_GENERATION_MODE === "manual" ? "manual" : "auto";
  res.json({ pvGenerationMode: mode });
});

export default router;