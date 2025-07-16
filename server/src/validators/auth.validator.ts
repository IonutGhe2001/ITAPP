import Joi from "joi";

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  nume: Joi.string().required(),
  prenume: Joi.string().required(),
  functie: Joi.string().required(),
  role: Joi.string().valid("admin", "user", "manager").required()
});
