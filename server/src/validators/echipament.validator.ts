import Joi from "joi";

export const createEchipamentSchema = Joi.object({
  nume: Joi.string().required(),
  tip: Joi.string().required(),
  stare: Joi.string().optional(),
  serie: Joi.string().required(),
  angajatId: Joi.string().uuid().allow(null, ""),
});

export const updateEchipamentSchema = Joi.object({
  nume: Joi.string().optional(),
  tip: Joi.string().optional(),
  stare: Joi.string().optional(),
  serie: Joi.string().optional(),
  angajatId: Joi.string().uuid().allow(null, "").optional(),
});