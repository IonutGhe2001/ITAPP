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

const uploadDoc = multer({
  dest: path.join(__dirname, "../../public/equipment-documents"),
});
const uploadImage = multer({
  dest: path.join(__dirname, "../../public/equipment-images"),
});

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
  uploadDoc.single("file"),
  docController.uploadDocument,
);
router.get("/:id/images", imageController.listImages);
router.post(
  "/:id/images",
  authorizeRoles("admin"),
  uploadImage.single("file"),
  imageController.uploadImage,
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
