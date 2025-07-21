import { Request, Response } from "express";
import * as XLSX from "xlsx";
import { processImportRows } from "../services/import.service";

export const uploadImportFile = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "Fisierul lipseste" });

    const workbook = XLSX.read(file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    const { results, errors } = await processImportRows(rows);

    res.json({ importate: results.length, erori: errors });
  } catch (err) {
    console.error("Import error:", err);
    res.status(500).json({ error: "Eroare server" });
  }
};
