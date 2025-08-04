import Joi from "joi";

export const createOnboardingSchema = Joi.object({
  angajatId: Joi.string().uuid().optional(),
  laptopId: Joi.string().required(),
  department: Joi.string().required(),
  tasks: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        completed: Joi.boolean().required(),
      })
    )
    .required(),
});
