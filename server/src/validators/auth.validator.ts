import Joi from "joi";

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Parola trebuie să aibă cel puțin 8 caractere, o literă mare și o cifră",
    }),
  nume: Joi.string().required(),
  prenume: Joi.string().required(),
  functie: Joi.string().required(),
  role: Joi.string().valid("admin", "user", "manager").required(),
});
