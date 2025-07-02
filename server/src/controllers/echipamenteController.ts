import { prisma } from "../config/db";
import { Request, Response, NextFunction } from "express";
import Joi from "joi";

// Validare pentru creare echipament
const echipamentSchema = Joi.object({
  nume: Joi.string().required(),
  serie: Joi.string().required(),
  tip: Joi.string().valid("laptop", "telefon", "sim").required(),
  angajatId: Joi.string().uuid().allow(null, "")
});

export const getEchipamente = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const echipamente = await prisma.echipament.findMany({
      include: { angajat: true }
    });
    res.json(echipamente);
  } catch (err) {
    next(err);
  }
};

export const createEchipament = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = echipamentSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { nume, serie, tip, angajatId } = req.body;

    const stare = angajatId ? "predat" : "disponibil";

    const echipament = await prisma.echipament.create({
      data: {
        nume,
        serie,
        tip,
        stare,
        angajatId: angajatId || null,
      },
    });

    res.status(201).json(echipament);
  } catch (err) {
    next(err);
  }
};


export const updateEchipament = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { stare, angajatId } = req.body;

    const updated = await prisma.echipament.update({
      where: { id },
      data: { stare, angajatId }
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteEchipament = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.echipament.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
