import express from "express";
import { getRecentUpdates } from "../lib/websocket";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.use(authenticate);

/**
 * GET /api/updates
 * Query parameters:
 *  - limit: number of updates to return
 *  - importance=high: return only high-importance updates
 */

router.get("/", (req, res) => {
  const limit = parseInt(req.query.limit as string, 10);
  const importance = req.query.importance === "high" ? "high" : undefined;
  let updates = getRecentUpdates(importance);
  if (!isNaN(limit) && limit > 0) {
    updates = updates.slice(0, limit);
  }
  res.json(updates);
});

export default router;
