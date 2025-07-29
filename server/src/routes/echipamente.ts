import express from "express";
import * as controller from "../controllers/echipamenteController";
import { validateRequest } from "../middlewares/validateRequest";
import { createEchipamentSchema, updateEchipamentSchema } from "../validators/echipament.validator";
import { authenticate, authorizeRoles } from "../middlewares/authMiddleware";

const router = express.Router();

router.use(authenticate);

router.get("/", controller.getEchipamente);
router.get("/stats", controller.getStats);
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