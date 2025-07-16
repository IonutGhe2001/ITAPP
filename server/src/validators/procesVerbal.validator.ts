import Joi from "joi";

export const createProcesVerbalSchema = Joi.object({
  angajatId: Joi.string().uuid().required(),
  observatii: Joi.string().allow(null, "").optional(),
});