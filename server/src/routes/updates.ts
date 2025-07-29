import express from 'express';
import { getRecentUpdates } from '../lib/websocket';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(authenticate);

router.get('/', (_req, res) => {
  res.json(getRecentUpdates());
});

export default router;