import { Request, Response, NextFunction } from "express";
import { logger } from "@lib/logger";

export function logRequest(req: Request, _res: Response, next: NextFunction) {
  logger.info(`${req.method} ${req.url}`);
  next();
}
