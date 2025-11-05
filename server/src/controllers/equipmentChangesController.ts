import { Request, Response } from "express";
import {
  getUnsyncedChanges,
  getEquipmentHistory as getEquipmentHistoryService,
} from "../services/equipmentChange.service";

export const getEquipmentChanges = async (req: Request, res: Response) => {
  const changes = await getUnsyncedChanges(req.params.angajatId);
  res.json(changes);
};

export const getEquipmentHistory = async (req: Request, res: Response) => {
  const { skip, take } = req.query;
  const history = await getEquipmentHistoryService(req.params.echipamentId, {
    skip: skip ? Number(skip) : undefined,
    take: take ? Number(take) : undefined,
  });
  res.json(history);
};
