import { Request, Response } from "express";
import * as service from "../services/purchaseRequest.service";

export const createPurchaseRequest = async (req: Request, res: Response) => {
  const { equipmentType, quantity } = req.body;
  const pr = await service.createPurchaseRequest({ equipmentType, quantity });
  res.status(201).json(pr);
};

export const getPurchaseRequests = async (_req: Request, res: Response) => {
  const prs = await service.getPurchaseRequests();
  res.json(prs);
};

export const updatePurchaseRequestStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const updated = await service.updatePurchaseRequestStatus(id, status);
  res.json(updated);
};