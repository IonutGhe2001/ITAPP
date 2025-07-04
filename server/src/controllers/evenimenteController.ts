import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/db";
import { AuthPayload } from "../middlewares/authMiddleware";
import Joi from "joi";

const evenimentSchema = Joi.object({
  titlu: Joi.string().min(2).required(),
  data: Joi.date().required(),
  ora: Joi.string().required(),
});

export const getEvenimente = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as AuthPayload;
    const evenimente = await prisma.eveniment.findMany({
      where: { userId: user.id },
    });
    res.json(evenimente);
  } catch (err) {
    next(err);
  }
};

export const createEveniment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = evenimentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const user = req.user as AuthPayload;
    const { titlu, data, ora } = req.body;

    const eveniment = await prisma.eveniment.create({
      data: {
        titlu,
        data: new Date(data),
        ora,
        userId: user.id,
      },
    });

    res.status(201).json(eveniment);
  } catch (err) {
    next(err);
  }
};

export const deleteEveniment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user as AuthPayload;

    const eveniment = await prisma.eveniment.findUnique({
      where: { id: Number(id) },
    });

    if (!eveniment || eveniment.userId !== user.id) {
      return res.status(404).json({ message: "Evenimentul nu a fost găsit." });
    }

    await prisma.eveniment.delete({ where: { id: Number(id) } });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Eroare la ștergerea evenimentului." });
  }
};

export const updateEveniment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user as AuthPayload;
    const { titlu, ora, data } = req.body;

    const eveniment = await prisma.eveniment.findUnique({
      where: { id: Number(id) },
    });

    if (!eveniment || eveniment.userId !== user.id) {
      return res.status(404).json({ message: "Evenimentul nu a fost găsit." });
    }

    const updatedEveniment = await prisma.eveniment.update({
      where: { id: Number(id) },
      data: {
        titlu,
        ora,
        data: data ? new Date(data) : eveniment.data,
      },
    });

    res.json(updatedEveniment);
  } catch (error) {
    res.status(500).json({ message: "Eroare la actualizarea evenimentului." });
  }
};