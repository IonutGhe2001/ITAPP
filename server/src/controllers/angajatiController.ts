import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/db";
import Joi from "joi";

// Joi schema pentru validare input
const angajatSchema = Joi.object({
  nume: Joi.string().min(2).required(),
  prenume: Joi.string().min(2).required(),
  email: Joi.string().email().allow(null, ""),
  telefon: Joi.string().min(10).allow(null, "")
});

// GET /api/angajati
export const getAngajati = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const angajati = await prisma.angajat.findMany({
      include: { echipamente: true }
    });
    res.json(angajati);
  } catch (err) {
    next(err);
  }
};

// POST /api/angajati
export const createAngajat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = angajatSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { nume, prenume, email, telefon } = req.body;
    const angajat = await prisma.angajat.create({
      data: { nume, prenume, email, telefon }
    });

    res.status(201).json(angajat);
  } catch (err) {
    next(err);
  }
};

// PUT /api/angajati/:id
export const updateAngajat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { email, telefon } = req.body;

    const updated = await prisma.angajat.update({
      where: { id }, // ID este string (UUID), deci nu îl convertim
      data: { email, telefon }
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/angajati/:id
export const deleteAngajat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    await prisma.angajat.delete({
      where: { id }
    });

    res.json({ message: "Angajat șters cu succes." });
  } catch (err) {
    next(err);
  }
};
