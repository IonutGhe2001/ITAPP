import { Request, Response, NextFunction } from "express";
import {
  getEchipamente as getEchipamenteService,
  getEchipament as getEchipamentService,
  createEchipament as createEchipamentService,
  updateEchipament as updateEchipamentService,
  deleteEchipament as deleteEchipamentService,
  getStats as getStatsService,
  getAvailableStock as getAvailableStockService,
  orderEchipament as orderEchipamentService,
  getEquipmentTypes as getEquipmentTypesService,
  type GetEchipamenteParams,
} from "../services/echipament.service";
import { emitUpdate } from "../lib/websocket";
import XLSX from "xlsx";

interface ExportableEchipament {
  nume: string;
  serie: string;
  tip: string;
  angajat?: { numeComplet?: string } | null;
}

type ListEchipamenteQuery = GetEchipamenteParams;

export const getEchipamente = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, pageSize, search, status, type, sort, sortBy } =
      req.query as unknown as ListEchipamenteQuery;

    const result = await getEchipamenteService({
      page,
      pageSize,
      search: search ?? undefined,
      status: status ?? undefined,
      type: type ?? undefined,
      sort,
      sortBy,
    } as GetEchipamenteParams);

    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const exportEchipamente = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const echipamente = await getEchipamenteService();
    const rows = echipamente.map((e: ExportableEchipament) => ({
      Nume: e.nume,
      Serie: e.serie,
      Tip: e.tip,
      Angajat: e.angajat?.numeComplet || "",
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Echipamente");
    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="echipamente.xlsx"'
    );
    res.send(buffer);
  } catch (err) {
    next(err);
  }
};

export const getEchipament = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const echipament = await getEchipamentService(id);
    if (!echipament) {
      res.status(404).json({ message: "Echipament negăsit" });
      return;
    }
    res.json(echipament);
  } catch (err) {
    next(err);
  }
};

export const createEchipament = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const echipament = await createEchipamentService(req.body);
    res.status(201).json(echipament);
    emitUpdate({
      type: "Echipament",
      message: `Echipament adăugat: ${echipament.nume}`,
      importance: "high",
    });
  } catch (err) {
    next(err);
  }
};

export const updateEchipament = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updated = await updateEchipamentService(id, req.body);
    res.json(updated);
    emitUpdate({
      type: "Echipament",
      message: "Echipament actualizat",
      importance: "normal",
    });
  } catch (err) {
    next(err);
  }
};

export const deleteEchipament = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await deleteEchipamentService(id);
    res.json({ message: "Echipament șters cu succes." });
    emitUpdate({
      type: "Echipament",
      message: "Echipament șters",
      importance: "high",
    });
  } catch (err) {
    next(err);
  }
};

export const getStats = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stats = await getStatsService();
    res.json(stats);
  } catch (err) {
    next(err);
  }
};

export const getAvailableStock = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stock = await getAvailableStockService();
    res.json(stock);
  } catch (err) {
    next(err);
  }
};

export const getEquipmentTypes = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const types = await getEquipmentTypesService();
    res.json(types);
  } catch (err) {
    next(err);
  }
};

export const orderEchipament = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { tip } = req.body;
    const item = await orderEchipamentService(tip);
    res.status(201).json(item);
    emitUpdate({
      type: "Echipament",
      message: `Comandă echipament: ${tip}`,
      importance: "high",
    });
  } catch (err) {
    next(err);
  }
};
