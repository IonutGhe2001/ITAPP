import express from 'express';
import { getRecentUpdates } from '../lib/websocket';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(authenticate);

router.get('/', (req, res) => {
  const limit = parseInt(req.query.limit as string, 10);
  let updates = getRecentUpdates();
  if (!isNaN(limit) && limit > 0) {
    updates = updates.slice(0, limit);
  }
  res.json(updates);
});

export default router;