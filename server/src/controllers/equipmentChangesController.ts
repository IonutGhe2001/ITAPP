import { Request, Response } from "express";
import { getUnsyncedChanges } from "../services/equipmentChange.service";

export const getEquipmentChanges = async (req: Request, res: Response) => {
  const changes = await getUnsyncedChanges(req.params.angajatId);
  res.json(changes);
};