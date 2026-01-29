import express from "express";
import multer from "multer";
import path from "path";
import * as controller from "../controllers/angajatiController";
import * as docController from "../controllers/angajatDocumentController";
import { validateRequest } from "../middlewares/validateRequest";
import {
  createAngajatSchema,
  updateAngajatSchema,
  createEmailAccountSchema,
  getAngajatiQuerySchema,
} from "../validators/angajat.validator";
import { authenticate, authorizeRoles } from "../middlewares/authMiddleware";

const router = express.Router();

router.use(authenticate);

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const docStorage = multer.diskStorage({
  destination: path.join(__dirname, "../../public/angajat-documents"),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const uploadDoc = multer({
  storage: docStorage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      (req as any).fileValidationError =
        "Sunt acceptate doar fișiere PDF și imagini (PNG, JPEG)";
      cb(null, false);
    }
  },
});

const handleUpload =
  (upload: ReturnType<multer.Multer["single"]>) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    upload(req, res, (err: unknown) => {
      if (err) {
        (req as any).multerError = err;
      }
      next();
    });
  };

router.get(
  "/",
  validateRequest(getAngajatiQuerySchema, "query"),
  controller.getAngajati
);
router.get("/full", controller.getAllAngajati);
router.get("/documents/:docId", docController.downloadDocument);
router.get("/:id", controller.getAngajatById);
router.get("/:id/documents", docController.listDocuments);
router.post(
  "/:id/documents",
  authorizeRoles("admin"),
  handleUpload(uploadDoc.single("file")),
  docController.uploadDocument
);
router.delete(
  "/:id/documents/:docId",
  authorizeRoles("admin"),
  docController.deleteDocument
);
router.post(
  "/",
  authorizeRoles("admin"),
  validateRequest(createAngajatSchema),
  controller.createAngajat
);
router.put(
  "/:id",
  authorizeRoles("admin"),
  validateRequest(updateAngajatSchema),
  controller.updateAngajat
);
router.post(
  "/:id/email-account",
  authorizeRoles("admin"),
  validateRequest(createEmailAccountSchema),
  controller.createEmailAccount
);
router.delete("/:id", authorizeRoles("admin"), controller.deleteAngajat);

export default router;
