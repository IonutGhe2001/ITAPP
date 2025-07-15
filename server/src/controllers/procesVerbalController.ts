import { Request, Response } from "express";
import { prisma } from "../config/db";
import { genereazaPDFProcesVerbal } from "../utils/pdfGenerator";

export const creareProcesVerbal = async (req: Request, res: Response) => {
  try {
    const { angajatId, observatii } = req.body;

    const angajat = await prisma.angajat.findUnique({
      where: { id: angajatId },
      include: { echipamente: true },
    });

    if (!angajat) {
      return res.status(404).json({ message: "Angajatul nu a fost găsit." });
    }

    const procesVerbal = await prisma.procesVerbal.create({
      data: {
        angajatId: angajat.id,
        observatii: observatii || null,
        echipamente: {
          connect: angajat.echipamente.map(eq => ({ id: eq.id })),
        },
      },
      include: {
        echipamente: true,
        angajat: true,
      },
    });

    const pdfBuffer = await genereazaPDFProcesVerbal({
      angajat: procesVerbal.angajat,
      echipamente: procesVerbal.echipamente,
      observatii: procesVerbal.observatii || "-",
      data: new Date().toLocaleDateString("ro-RO"),
      firma: "Creative & Innovative Management SRL",
    });

    console.log("PDF length:", pdfBuffer.length); // pentru verificare

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=proces-verbal-${procesVerbal.id}.pdf`,
      "Content-Length": pdfBuffer.length,
    }).send(pdfBuffer);

  } catch (error) {
    console.error("Eroare la creare proces verbal:", error);
    res.status(500).json({ message: "Eroare la generarea procesului verbal." });
  }
};
