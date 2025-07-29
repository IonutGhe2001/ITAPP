import express from "express";
import { authenticate } from "../middlewares/authMiddleware";
import * as controller from "../controllers/searchController";

const router = express.Router();

router.use(authenticate);
router.get("/", controller.search);
router.get("/suggestions", controller.suggestions);

export default router;