import Joi from "joi";

export const createEchipamentSchema = Joi.object({
  nume: Joi.string().required(),
  tip: Joi.string().required(),
  stare: Joi.string()
    .valid("in_stoc", "alocat", "in_comanda", "mentenanta")
    .optional(),
  serie: Joi.string().required(),
  angajatId: Joi.string().uuid().allow(null, ""),
  cpu: Joi.string().optional(),
  ram: Joi.string().optional(),
  stocare: Joi.string().optional(),
  os: Joi.string().optional(),
  versiuneFirmware: Joi.string().optional(),
  numarInventar: Joi.string().optional(),
  dataAchizitie: Joi.date().iso().optional(),
  garantie: Joi.date().iso().optional(),
  metadata: Joi.any().optional(),
});

export const updateEchipamentSchema = Joi.object({
  nume: Joi.string().optional(),
  tip: Joi.string().optional(),
  stare: Joi.string()
    .valid("in_stoc", "alocat", "in_comanda", "mentenanta")
    .optional(),
  serie: Joi.string().optional(),
  angajatId: Joi.string().uuid().allow(null, "").optional(),
  cpu: Joi.string().optional(),
  ram: Joi.string().optional(),
  stocare: Joi.string().optional(),
  os: Joi.string().optional(),
  versiuneFirmware: Joi.string().optional(),
  numarInventar: Joi.string().optional(),
  dataAchizitie: Joi.date().iso().optional(),
  garantie: Joi.date().iso().optional(),
  metadata: Joi.any().optional(),
});
