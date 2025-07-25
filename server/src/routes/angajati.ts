import express from "express";
import * as controller from "../controllers/angajatiController";
import { validateRequest } from "../middlewares/validateRequest";
import { createAngajatSchema, updateAngajatSchema } from "../validators/angajat.validator";
import { authenticate, authorizeRoles } from "../middlewares/authMiddleware";

const router = express.Router();

router.use(authenticate);

router.get("/", controller.getAngajati);
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
router.delete("/:id", authorizeRoles("admin"), controller.deleteAngajat);

export default router;