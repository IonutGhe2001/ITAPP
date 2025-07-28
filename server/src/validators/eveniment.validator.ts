import Joi from "joi";

export const createEvenimentSchema = Joi.object({
  titlu: Joi.string().min(2).required(),
  data: Joi.date().required(),
  ora: Joi.string().allow("").optional(),
  recurrence: Joi.string()
    .valid("none", "daily", "weekly", "monthly")
    .optional(),
});

export const updateEvenimentSchema = Joi.object({
  titlu: Joi.string().min(2).optional(),
  data: Joi.date().optional(),
  ora: Joi.string().optional(),
  recurrence: Joi.string()
    .valid("none", "daily", "weekly", "monthly")
    .optional(),
});