import { prisma } from "../config/db";
import { Request, Response } from "express";

export const getEchipamente = async (_: Request, res: Response) => {
  const echipamente = await prisma.echipament.findMany({
    include: { angajat: true },
  });
  res.json(echipamente);
};

export const createEchipament = async (req: Request, res: Response) => {
  const { nume, tip, stare, angajatId } = req.body;
  const echipament = await prisma.echipament.create({
    data: { nume, tip, stare, angajatId },
  });
  res.status(201).json(echipament);
};

export const updateEchipament = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { stare, angajatId } = req.body;
  const updated = await prisma.echipament.update({
    where: { id },
    data: { stare, angajatId },
  });
  res.json(updated);
};

export const deleteEchipament = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.echipament.delete({ where: { id } });
  res.status(204).send();
};
