import Joi from "joi";

export const createEchipamentSchema = Joi.object({
  nume: Joi.string().required(),
  tip: Joi.string().required(),
  stare: Joi.string().required(),
  serie: Joi.string().required(),
  angajatId: Joi.string().uuid().allow(null, ""),
});

export const updateEchipamentSchema = Joi.object({
  serie: Joi.string().optional(),
});