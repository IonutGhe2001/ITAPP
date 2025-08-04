import Joi from "joi";

export const createPurchaseRequestSchema = Joi.object({
  equipmentType: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
});

export const updatePurchaseRequestStatusSchema = Joi.object({
  status: Joi.string().valid("PENDING", "ORDERED", "DELIVERED").required(),
});
