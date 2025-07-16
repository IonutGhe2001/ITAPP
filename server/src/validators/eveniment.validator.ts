import Joi from "joi";

export const createEvenimentSchema = Joi.object({
  titlu: Joi.string().min(2).required(),
  data: Joi.date().required(),
  ora: Joi.string().required(),
});

export const updateEvenimentSchema = Joi.object({
  titlu: Joi.string().min(2).optional(),
  data: Joi.date().optional(),
  ora: Joi.string().optional(),
});