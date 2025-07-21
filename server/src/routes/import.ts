import express from "express";
import { uploadImportFile } from "../controllers/import.controller";
import multer from "multer";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/echipamente", authenticate, upload.single("file"), uploadImportFile);

export default router;
