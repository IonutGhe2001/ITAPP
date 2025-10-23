import Joi from "joi";
import { EQUIPMENT_STATUS } from "@shared/equipmentStatus";

const statusValues = Object.values(EQUIPMENT_STATUS);

export const listEchipamenteQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(100).default(20),
  search: Joi.string().trim().max(100).allow(null).empty("").optional(),
  status: Joi.string()
    .valid(...statusValues)
    .insensitive()
    .empty("")
    .optional(),
  type: Joi.string().trim().max(100).empty("").optional(),
  sort: Joi.string().valid("asc", "desc").default("asc"),
  sortBy: Joi.string().valid("nume", "createdAt", "tip", "stare").default("nume"),
});

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
