import express from "express";
import * as controller from "../controllers/echipamenteController";
import * as docController from "../controllers/equipmentDocumentController";
import * as imageController from "../controllers/equipmentImageController";
import multer from "multer";
import path from "path";
import { validateRequest } from "../middlewares/validateRequest";
import {
  createEchipamentSchema,
  updateEchipamentSchema,
} from "../validators/echipament.validator";
import { authenticate, authorizeRoles } from "../middlewares/authMiddleware";

const router = express.Router();

router.use(authenticate);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const uploadDoc = multer({
  dest: path.join(__dirname, "../../public/equipment-documents"),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      (req as any).fileValidationError = "Sunt acceptate doar fișiere PDF";
      cb(null, false);
    }
  },
});

const uploadImage = multer({
  dest: path.join(__dirname, "../../public/equipment-images"),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (["image/png", "image/jpeg"].includes(file.mimetype)) {
      cb(null, true);
    } else {
      (req as any).fileValidationError =
        "Sunt acceptate doar imagini PNG sau JPEG";
      cb(null, false);
    }
  },
});

const handleUpload =
  (upload: ReturnType<multer.Multer["single"]>) =>
  (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    upload(req, res, (err: unknown) => {
      if (err) {
        (req as any).multerError = err;
      }
      next();
    });
  };

router.get("/", controller.getEchipamente);
router.get("/stats", controller.getStats);
router.get("/stock", controller.getAvailableStock);
router.post("/order", authorizeRoles("admin"), controller.orderEchipament);
router.get("/documents/:docId", docController.downloadDocument);
router.get("/:id", controller.getEchipament);
router.get("/:id/documents", docController.listDocuments);
router.post(
  "/:id/documents",
  authorizeRoles("admin"),
  handleUpload(uploadDoc.single("file")),
  docController.uploadDocument
);
router.get("/:id/images", imageController.listImages);
router.post(
  "/:id/images",
  authorizeRoles("admin"),
  handleUpload(uploadImage.single("file")),
  imageController.uploadImage
);
router.post(
  "/",
  authorizeRoles("admin"),
  validateRequest(createEchipamentSchema),
  controller.createEchipament
);
router.put(
  "/:id",
  authorizeRoles("admin"),
  validateRequest(updateEchipamentSchema),
  controller.updateEchipament
);
router.delete("/:id", authorizeRoles("admin"), controller.deleteEchipament);

export default router;
