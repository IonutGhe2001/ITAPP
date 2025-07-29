import { Request, Response, NextFunction } from "express";
import * as echipamentService from "../services/echipament.service";
import { emitUpdate } from "../lib/websocket";

export const getEchipamente = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const echipamente = await echipamentService.getEchipamente();
    res.json(echipamente);
  } catch (err) {
    next(err);
  }
};

export const createEchipament = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const echipament = await echipamentService.createEchipament(req.body);
    res.status(201).json(echipament);
    emitUpdate({
      type: "Echipament",
      message: `Echipament adăugat: ${echipament.nume}`,
    });
  } catch (err) {
    next(err);
  }
};

export const updateEchipament = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updated = await echipamentService.updateEchipament(id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteEchipament = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await echipamentService.deleteEchipament(id);
    res.json({ message: "Echipament șters cu succes." });
  } catch (err) {
    next(err);
  }
};