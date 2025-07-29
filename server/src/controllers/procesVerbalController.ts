import { Request, Response } from "express";
import { creeazaProcesVerbalCuEchipamente } from "../services/procesVerbal.service";
import { genereazaPDFProcesVerbal } from "../utils/pdfGenerator";
import { logger } from "@lib/logger";

export const creareProcesVerbal = async (req: Request, res: Response) => {
  try {
    const { angajatId, observatii } = req.body;
    const procesVerbal = await creeazaProcesVerbalCuEchipamente(angajatId, observatii);

    if (!procesVerbal) {
      return res.status(404).json({ message: "Angajatul nu a fost găsit." });
    }

    const pdfBuffer = await genereazaPDFProcesVerbal({
      angajat: procesVerbal.angajat,
      echipamente: procesVerbal.echipamente,
      observatii: procesVerbal.observatii || "-",
      data: new Date().toLocaleDateString("ro-RO"),
      firma: "Creative & Innovative Management SRL",
    });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=proces-verbal-${procesVerbal.id}.pdf`,
      "Content-Length": pdfBuffer.length,
    }).send(pdfBuffer);
  } catch (error) {
    logger.error("Eroare la creare proces verbal:", error);
    res.status(500).json({ message: "Eroare la generarea procesului verbal." });
  }
};
