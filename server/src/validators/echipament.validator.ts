import Joi from "joi";

export const createEchipamentSchema = Joi.object({
  nume: Joi.string().required(),
  tip: Joi.string().required(),
  stare: Joi.string()
    .valid("disponibil", "predat", "mentenanta")
    .optional(),
  serie: Joi.string().required(),
  angajatId: Joi.string().uuid().allow(null, ""),
  metadata: Joi.any().optional(),
});

export const updateEchipamentSchema = Joi.object({
  nume: Joi.string().optional(),
  tip: Joi.string().optional(),
   stare: Joi.string()
    .valid("disponibil", "predat", "mentenanta")
    .optional(),
  serie: Joi.string().optional(),
  angajatId: Joi.string().uuid().allow(null, "").optional(),
  metadata: Joi.any().optional(),
});
