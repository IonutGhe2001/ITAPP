import { Request, Response } from "express";
import * as XLSX from "xlsx";
import { processImportRows } from "../services/import.service";
import type { ImportRow } from "../services/import.service";

export const uploadImportFile = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "Fisierul lipseste" });

    const workbook = XLSX.read(file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

const rows: ImportRow[] = rawRows.map((row: any) => ({
  "Nume Echipament": String(row["Nume Echipament"] ?? ""),
  Tip: String(row["Tip"] ?? ""),
  Serie: String(row["Serie"] ?? ""),
  "Email Angajat": row["Email Angajat"] ? String(row["Email Angajat"]) : undefined,
}));

const { results, errors } = await processImportRows(rows);

    res.json({ importate: results.length, erori: errors });
  } catch (err) {
    console.error("Import error:", err);
    res.status(500).json({ error: "Eroare server" });
  }
};
