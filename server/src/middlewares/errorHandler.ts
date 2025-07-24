import { Request, Response, NextFunction } from "express";
import { ValidationError as JoiValidationError } from "joi";
import { Prisma } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err);

  // Joi validation
  if (err instanceof JoiValidationError) {
    return res.status(400).json({ error: err.details[0].message });
  }

  // Prisma unique constraint
  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({ error: `Valoarea introdusă există deja.` });
    }
  }

  // Token errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "Token invalid" });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ error: "Token expirat" });
  }

  // Default
  return res.status(err.status || 500).json({
    success: false,
    message: err.message || "Eroare internă",
  });
}