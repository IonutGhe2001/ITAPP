import { Request, Response, NextFunction } from "express";
import {
  getOverviewStats as getOverviewStatsService,
  getEquipmentStatusTimeline as getEquipmentStatusTimelineService,
  getAlerts as getAlertsService,
  getPvQueue as getPvQueueService,
  getActivity as getActivityService,
} from "../services/dashboard.service";

export const getOverviewStats = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stats = await getOverviewStatsService();
    res.json(stats);
  } catch (err) {
    next(err);
  }
};

export const getEquipmentStatusTimeline = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const timeline = await getEquipmentStatusTimelineService();
    res.json(timeline);
  } catch (err) {
    next(err);
  }
};

export const getAlerts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const alerts = await getAlertsService(limit);
    res.json(alerts);
  } catch (err) {
    next(err);
  }
};

export const getPvQueue = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const queue = await getPvQueueService(limit);
    res.json(queue);
  } catch (err) {
    next(err);
  }
};

export const getActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const activity = await getActivityService(limit);
    res.json(activity);
  } catch (err) {
    next(err);
  }
};
