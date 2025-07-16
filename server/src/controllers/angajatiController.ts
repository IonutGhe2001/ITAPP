import { Request, Response, NextFunction } from "express";
import * as angajatService from "../services/angajat.service";

export const getAngajati = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const angajati = await angajatService.getAngajati();
    res.json(angajati);
  } catch (err) {
    next(err);
  }
};

export const createAngajat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const angajat = await angajatService.createAngajat(req.body);
    res.status(201).json(angajat);
  } catch (err) {
    next(err);
  }
};

export const updateAngajat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updated = await angajatService.updateAngajat(id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteAngajat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await angajatService.deleteAngajat(id);
    res.json({ message: "Angajat șters cu succes." });
  } catch (err) {
    next(err);
  }
};