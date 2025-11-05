import { Request, Response, NextFunction } from "express";
import {
  getUserMetrics as getUserMetricsService,
  getUserActivity as getUserActivityService,
  getUserSessions as getUserSessionsService,
} from "../services/profile.service";

export const getUserMetrics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(req.user!.id);
    const metrics = await getUserMetricsService(userId);
    res.json(metrics);
  } catch (err) {
    next(err);
  }
};

export const getUserActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(req.user!.id);
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const activity = await getUserActivityService(userId, limit);
    res.json(activity);
  } catch (err) {
    next(err);
  }
};

export const getUserSessions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(req.user!.id);
    const sessions = await getUserSessionsService(userId);
    res.json(sessions);
  } catch (err) {
    next(err);
  }
};