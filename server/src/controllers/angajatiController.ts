import { Request, Response, NextFunction } from "express";
import * as angajatService from "../services/angajat.service";
import { emitUpdate } from "../lib/websocket";
import { EmailAccountStatus } from "@prisma/client";

type GetAngajatiQuery = {
  page: number;
  pageSize: number;
  department?: string;
  status?: EmailAccountStatus;
};

const normalizeQueryValue = (value: unknown) => {
  if (Array.isArray(value)) {
    return typeof value[0] === "string" ? value[0] : undefined;
  }

  return typeof value === "string" ? value : undefined;
};

const parseNumberParam = (value: unknown, defaultValue: number) => {
  const normalized = normalizeQueryValue(value);
  if (!normalized) {
    return defaultValue;
  }

  const parsed = Number.parseInt(normalized, 10);
  return Number.isNaN(parsed) ? defaultValue : parsed;
};

const parseStatusParam = (value: unknown): EmailAccountStatus | undefined => {
  const normalized = normalizeQueryValue(value);
  if (!normalized) {
    return undefined;
  }

  return (Object.values(EmailAccountStatus) as string[]).includes(normalized)
    ? (normalized as EmailAccountStatus)
    : undefined;
};

export const getAngajati = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseNumberParam(req.query.page, 1);
    const pageSize = parseNumberParam(req.query.pageSize, 25);
    const department = normalizeQueryValue(req.query.department);
    const status = parseStatusParam(req.query.status);

    const params: GetAngajatiQuery = {
      page,
      pageSize,
      department: department ?? undefined,
      status,
    };
    const response = await angajatService.getAngajati(params);
    res.json(response);
  } catch (err) {
    next(err);
  }
};

export const getAllAngajati = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const angajati = await angajatService.getAllAngajati();
    res.json(angajati);
  } catch (err) {
    next(err);
  }
};

export const getAngajatById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const angajat = await angajatService.getAngajatById(id);
    res.json(angajat);
  } catch (err) {
    next(err);
  }
};

export const createAngajat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const angajat = await angajatService.createAngajat(req.body);
    res.status(201).json(angajat);
    emitUpdate({
      type: "Coleg",
      message: `Coleg nou: ${angajat.numeComplet}`,
      importance: "high",
    });
  } catch (err) {
    next(err);
  }
};

export const updateAngajat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updated = await angajatService.updateAngajat(id, req.body);
    res.json(updated);
    emitUpdate({
      type: "Coleg",
      message: "Coleg actualizat",
      importance: "normal",
    });
  } catch (err) {
    next(err);
  }
};

export const deleteAngajat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await angajatService.deleteAngajat(id);
    res.json({ message: "Angajat șters cu succes." });
    emitUpdate({
      type: "Coleg",
      message: "Coleg șters",
      importance: "high",
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
      message: "Cont e-mail marcat ca creat",
      importance: "normal",
    });
  } catch (err) {
    next(err);
  }
};
