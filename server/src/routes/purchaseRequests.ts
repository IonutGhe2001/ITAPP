import express from "express";
import * as controller from "../controllers/purchaseRequestController";
import { validateRequest } from "../middlewares/validateRequest";
import {
  createPurchaseRequestSchema,
  updatePurchaseRequestStatusSchema,
} from "../validators/purchaseRequest.validator";
import { authenticate, authorizeRoles } from "../middlewares/authMiddleware";

const router = express.Router();

router.use(authenticate);

router.get("/", authorizeRoles("admin"), controller.getPurchaseRequests);
router.post(
  "/",
  validateRequest(createPurchaseRequestSchema),
  controller.createPurchaseRequest
);
router.patch(
  "/:id",
  authorizeRoles("admin"),
  validateRequest(updatePurchaseRequestStatusSchema),
  controller.updatePurchaseRequestStatus
);

export default router;