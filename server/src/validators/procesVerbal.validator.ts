import Joi from "joi";

export const createProcesVerbalSchema = Joi.object({
  angajatId: Joi.string().uuid().required(),
  observatii: Joi.string().allow(null, "").optional(),
  tip: Joi.string()
    .valid("PREDARE_PRIMIRE", "RESTITUIRE", "SCHIMB")
    .optional(),
  echipamentIds: Joi.array().items(Joi.string().uuid()).optional(),
  echipamentePredate: Joi.array().items(Joi.string().uuid()).optional(),
  echipamentePrimite: Joi.array().items(Joi.string().uuid()).optional(),
  });

export const procesVerbalFromChangesSchema = Joi.object({
  angajatId: Joi.string().uuid().required(),
});