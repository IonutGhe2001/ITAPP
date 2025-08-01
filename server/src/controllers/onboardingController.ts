import { Request, Response, NextFunction } from "express";
import * as onboardingService from "../services/onboarding.service";

export const getPackages = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { department } = req.params;
    const packages = onboardingService.getRecommendedPackages(department);
    res.json(packages);
  } catch (err) {
    next(err);
  }
};

export const createOnboarding = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const record = await onboardingService.createOnboarding(req.body);
    res.status(201).json(record);
  } catch (err) {
    next(err);
  }
};