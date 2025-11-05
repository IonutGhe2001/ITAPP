import express from "express";
import * as controller from "../controllers/angajatiController";
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

router.get(
  "/",
  validateRequest(getAngajatiQuerySchema, "query"),
  controller.getAngajati
);
router.get("/full", controller.getAllAngajati);
router.get("/:id", controller.getAngajatById);
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
