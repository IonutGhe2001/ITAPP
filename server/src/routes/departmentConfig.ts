import express from "express";
import * as controller from "../controllers/departmentConfigController";
import { authenticate, authorizeRoles } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validateRequest";
import {
  createDepartmentConfigSchema,
  updateDepartmentConfigSchema,
} from "../validators/departmentConfig.validator";

const router = express.Router();

router.use(authenticate);

router.get("/", controller.list);
router.post(
  "/",
  authorizeRoles("admin"),
  validateRequest(createDepartmentConfigSchema),
  controller.create
);
router.put(
  "/:id",
  authorizeRoles("admin"),
  validateRequest(updateDepartmentConfigSchema),
  controller.update
);

export default router;