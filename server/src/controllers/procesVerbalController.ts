import { Request, Response } from "express";
import {
  creeazaProcesVerbalCuEchipamente,
  creeazaProcesVerbalDinSchimbari,
} from "../services/procesVerbal.service";
import { ProcesVerbalTip } from "@prisma/client";
import { genereazaPDFProcesVerbal } from "../utils/pdfGenerator";
import { logger } from "@lib/logger";
import { getUserById } from "../services/auth.service";
import { prisma } from "../lib/prisma";

export const creareProcesVerbal = async (req: Request, res: Response) => {
  try {
     const { angajatId, observatii, tip, echipamentIds, echipamentePredate, echipamentePrimite } = req.body;
    const result = await creeazaProcesVerbalCuEchipamente(
      angajatId,
      observatii,
      tip as ProcesVerbalTip,
      echipamentIds,
      echipamentePredate,
      echipamentePrimite
    );

    if (!result) {
      return res.status(404).json({ message: "Angajatul nu a fost găsit." });
    }

    const { procesVerbal, echipamentePredate: predate, echipamentePrimite: primite } = result;

    const currentUser = await getUserById(Number(req.user!.id));

    const pdfBuffer = await genereazaPDFProcesVerbal({
      angajat: procesVerbal.angajat,
      echipamente: procesVerbal.echipamente,
      echipamentePredate: predate,
      echipamentePrimite: primite,
      observatii: procesVerbal.observatii || "-",
      tip: procesVerbal.tip,
      data: new Date().toLocaleDateString("ro-RO"),
      firma: "Creative & Innovative Management SRL",
      digitalSignature: currentUser?.digitalSignature,
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

export const creareProcesVerbalDinSchimbari = async (
  req: Request,
  res: Response
) => {
  try {
    const { angajatId } = req.body;
    const result = await creeazaProcesVerbalDinSchimbari(angajatId);

    if (!result) {
      return res
        .status(404)
        .json({ message: "Nu există schimbări de procesat." });
    }

    const { pdfBuffer, schimbariIds, procesVerbalId } = result;

    // @ts-ignore - equipmentChange may not be typed yet
    await prisma.equipmentChange.updateMany({
      where: { id: { in: schimbariIds } },
      data: { finalized: true },
    });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=proces-verbal-${procesVerbalId}.pdf`,
      "Content-Length": pdfBuffer.length,
    }).send(pdfBuffer);
  } catch (error) {
    logger.error(
      "Eroare la creare proces verbal din schimbari:",
      error
    );
    res
      .status(500)
      .json({ message: "Eroare la generarea procesului verbal." });
  }
};