import { Request, Response, NextFunction } from "express";
import * as service from "../services/departmentConfig.service";

export const list = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const configs = await service.getConfigs();
    res.json(configs);
  } catch (err) {
    next(err);
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const config = await service.createConfig(req.body);
    res.status(201).json(config);
  } catch (err) {
    next(err);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const config = await service.updateConfig(id, req.body);
    res.json(config);
  } catch (err) {
    next(err);
  }
};
