import { Request, Response, NextFunction } from "express";
import * as evenimentService from "../services/eveniment.service";

export const getEvenimente = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number((req.user as any).id);
    const evenimente = await evenimentService.getEvenimenteByUser(userId);
    res.json(evenimente);
  } catch (err) {
    next(err);
  }
};

export const createEveniment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number((req.user as any).id);
    const { titlu, data, ora } = req.body;
    const eveniment = await evenimentService.createEveniment({
      titlu,
      ora,
      data: new Date(data),
      userId,
    });
    res.status(201).json(eveniment);
  } catch (err) {
    next(err);
  }
};

export const updateEveniment = async (req: Request, res: Response) => {
  const userId = Number((req.user as any).id);
  const { id } = req.params;
  const result = await evenimentService.updateEveniment(Number(id), userId, req.body);
  if (!result) return res.status(404).json({ message: "Evenimentul nu a fost găsit." });
  res.json(result);
};

export const deleteEveniment = async (req: Request, res: Response) => {
  const userId = Number((req.user as any).id);
  const { id } = req.params;
  const success = await evenimentService.deleteEveniment(Number(id), userId);
  if (!success) return res.status(404).json({ message: "Evenimentul nu a fost găsit." });
  res.status(204).send();
};