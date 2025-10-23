import Joi from "joi";
import { EmailAccountStatus } from "@prisma/client";

export const createAngajatSchema = Joi.object({
  numeComplet: Joi.string().min(2).required(),
  functie: Joi.string().min(2).required(),
  email: Joi.string().email().allow(null, ""),
  telefon: Joi.string().min(10).allow(null, ""),
  departmentConfigId: Joi.string().uuid().allow(null, ""),
  dataAngajare: Joi.date().optional(),
  cDataUsername: Joi.string().allow(null, ""),
  cDataId: Joi.string().allow(null, ""),
  cDataNotes: Joi.string().allow(null, ""),
  cDataCreated: Joi.boolean(),
});

export const updateAngajatSchema = Joi.object({
  numeComplet: Joi.string().min(2),
  functie: Joi.string().min(2),
  email: Joi.string().email().allow(null, ""),
  telefon: Joi.string().min(10).allow(null, ""),
  departmentConfigId: Joi.string().uuid().allow(null, ""),
  dataAngajare: Joi.date().optional(),
  cDataUsername: Joi.string().allow(null, ""),
  cDataId: Joi.string().allow(null, ""),
  cDataNotes: Joi.string().allow(null, ""),
  cDataCreated: Joi.boolean(),
});

export const createEmailAccountSchema = Joi.object({
  email: Joi.string().email().required(),
  responsible: Joi.string().min(2).required(),
  link: Joi.string().uri().allow(null, ""),
});

export const getAngajatiQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(100).default(25),
  department: Joi.string().uuid().optional(),
  status: Joi.string()
    .valid(...Object.values(EmailAccountStatus))
    .optional(),
});