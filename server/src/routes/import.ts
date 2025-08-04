import express from "express";
import { uploadImportFile } from "../controllers/import.controller";
import multer from "multer";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (
      [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ].includes(file.mimetype)
    ) {
      cb(null, true);
    } else {
      cb(new Error("Tip fișier invalid"));
    }
  },
});

router.post(
  "/echipamente",
  authenticate,
  upload.single("file"),
  uploadImportFile
);

export default router;
