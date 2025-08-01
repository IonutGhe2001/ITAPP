import Joi from "joi";

export const createDepartmentConfigSchema = Joi.object({
  name: Joi.string().min(2).required(),
  defaultLicenses: Joi.array().items(Joi.string()).default([]),
  defaultRequirements: Joi.array().items(Joi.string()).default([]),
});

export const updateDepartmentConfigSchema = Joi.object({
  name: Joi.string().min(2),
  defaultLicenses: Joi.array().items(Joi.string()),
  defaultRequirements: Joi.array().items(Joi.string()),
});