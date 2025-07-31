import Joi from "joi";

export const createAngajatSchema = Joi.object({
  numeComplet: Joi.string().min(2).required(),
  functie: Joi.string().min(2).required(),
  email: Joi.string().email().allow(null, ""),
  telefon: Joi.string().min(10).allow(null, ""),
});

export const updateAngajatSchema = Joi.object({
  numeComplet: Joi.string().min(2),
  functie: Joi.string().min(2),
  email: Joi.string().email().allow(null, ""),
  telefon: Joi.string().min(10).allow(null, ""),
});