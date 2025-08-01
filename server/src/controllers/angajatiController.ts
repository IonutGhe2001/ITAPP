import { Request, Response, NextFunction } from "express";
import * as angajatService from "../services/angajat.service";
import { emitUpdate } from "../lib/websocket";

export const getAngajati = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const angajati = await angajatService.getAngajati();
    res.json(angajati);
  } catch (err) {
    next(err);
  }
};

export const getAngajatById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const angajat = await angajatService.getAngajatById(id);
    res.json(angajat);
  } catch (err) {
    next(err);
  }
};

export const createAngajat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const angajat = await angajatService.createAngajat(req.body);
    res.status(201).json(angajat);
    emitUpdate({
      type: "Coleg",
      message: `Coleg nou: ${angajat.numeComplet}`,
      importance: 'high',
    });
  } catch (err) {
    next(err);
  }
};

export const updateAngajat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updated = await angajatService.updateAngajat(id, req.body);
    res.json(updated);
    emitUpdate({
      type: "Coleg",
      message: "Coleg actualizat",
      importance: 'normal',
    });
  } catch (err) {
    next(err);
  }
};

export const deleteAngajat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await angajatService.deleteAngajat(id);
    res.json({ message: "Angajat șters cu succes." });
     emitUpdate({
      type: "Coleg",
      message: "Coleg șters",
      importance: 'high',
    });
  } catch (err) {
    next(err);
  }
  };

export const createEmailAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { email, responsible, link } = req.body;
    const updated = await angajatService.createEmailAccount(id, {
      email,
      responsible,
      link,
    });
    res.json(updated);
    emitUpdate({
      type: "Coleg",
      message: "Cont e-mail creat",
      importance: 'normal',
    });
  } catch (err) {
    next(err);
  }
};