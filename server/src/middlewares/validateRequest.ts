import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";

type RequestProperty = "body" | "query" | "params";

export const validateRequest = (
  schema: ObjectSchema,
  property: RequestProperty = "body"
) =>
  (req: Request, res: Response, next: NextFunction) => {
    const target = (req as any)[property];
    const { error, value } = schema.validate(target, {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    (req as any)[property] = value;
    next();
  };
