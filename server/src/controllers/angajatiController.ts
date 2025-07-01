import { Request, Response } from "express";
import { prisma } from "../config/db";

// Get all angajati
export const getAngajati = async (_: Request, res: Response) => {
  try {
    const angajati = await prisma.angajat.findMany({
      include: { echipamente: true },
    });
    res.json(angajati);
  } catch (err) {
    res.status(500).json({ error: "Eroare la preluarea angajaților" });
  }
};

// Create new angajat
export const createAngajat = async (req: Request, res: Response) => {
  try {
    const { nume, prenume, email, telefon } = req.body;

    const angajat = await prisma.angajat.create({
      data: { nume, prenume, email, telefon },
    });

    res.status(201).json(angajat);
  } catch (err) {
    res.status(400).json({ error: "Eroare la creare angajat" });
  }
};

// Update angajat
export const updateAngajat = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email, telefon } = req.body;

    const updated = await prisma.angajat.update({
      where: { id },
      data: { email, telefon },
    });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Eroare la actualizare angajat" });
  }
};

// Delete angajat
export const deleteAngajat = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.angajat.delete({ where: { id } });

    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: "Eroare la ștergere angajat" });
  }
};
