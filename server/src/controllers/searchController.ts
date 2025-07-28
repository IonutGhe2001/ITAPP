import { Request, Response, NextFunction } from "express";
import * as searchService from "../services/search.service";

export const search = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = (req.query.q as string) || "";
    const results = await searchService.globalSearch(q);
    res.json(results);
  } catch (err) {
    next(err);
  }
};