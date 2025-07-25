import express from "express";
import * as controller from "../controllers/evenimenteController";
import { validateRequest } from "../middlewares/validateRequest";
import { createEvenimentSchema, updateEvenimentSchema } from "../validators/eveniment.validator";
import { authenticate, authorizeRoles } from "../middlewares/authMiddleware";

const router = express.Router();

router.use(authenticate);

router.get("/", controller.getEvenimente);
router.post(
  "/",
  authorizeRoles("admin"),
  validateRequest(createEvenimentSchema),
  controller.createEveniment
);
router.patch(
  "/:id",
  authorizeRoles("admin"),
  validateRequest(updateEvenimentSchema),
  controller.updateEveniment
);
router.delete("/:id", authorizeRoles("admin"), controller.deleteEveniment);


export default router;
