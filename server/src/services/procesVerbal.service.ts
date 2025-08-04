import { prisma } from "../lib/prisma";
import { ProcesVerbalTip } from "@prisma/client";
import { genereazaPDFProcesVerbal } from "../utils/pdfGenerator";

export const creeazaProcesVerbalCuEchipamente = async (
  angajatId: string,
  observatii?: string | null,
  tip: ProcesVerbalTip = ProcesVerbalTip.PREDARE_PRIMIRE,
  echipamentIds?: string[],
  echipamentePredateIds?: string[],
  echipamentePrimiteIds?: string[]
) => {
  const angajat = await prisma.angajat.findUnique({
    where: { id: angajatId },
    include: { echipamente: true },
  });

  if (!angajat) return null;

  const idsToConnect = (
    echipamentIds
      ? angajat.echipamente.filter((eq: { id: string }) =>
          echipamentIds.includes(eq.id)
        )
      : angajat.echipamente
  ).map((eq: { id: string }) => ({ id: eq.id }));

  const procesVerbal = await prisma.procesVerbal.create({
    data: {
      angajatId: angajat.id,
      observatii: observatii || null,
      tip,
      echipamente: {
        connect: idsToConnect,
      },
    },
    include: {
      echipamente: true,
      angajat: true,
    },
  });

  const echipamentePredate =
    echipamentePredateIds && echipamentePredateIds.length
      ? await prisma.echipament.findMany({
          where: { id: { in: echipamentePredateIds } },
        })
      : [];

  const echipamentePrimite =
    echipamentePrimiteIds && echipamentePrimiteIds.length
      ? await prisma.echipament.findMany({
          where: { id: { in: echipamentePrimiteIds } },
        })
      : [];

  const involvedIds = [
    ...idsToConnect.map((i: { id: string }) => i.id),
    ...(echipamentePredateIds ?? []),
    ...(echipamentePrimiteIds ?? []),
  ];

  if (involvedIds.length) {
    await prisma.equipmentChange.updateMany({
      where: {
        angajatId: angajat.id,
        echipamentId: { in: involvedIds },
        includedInPV: false,
      },
      data: { includedInPV: true },
    });
  }

  return { procesVerbal, echipamentePredate, echipamentePrimite };
};

export const creeazaProcesVerbalDinSchimbari = async (angajatId: string) => {
  interface SchimbareExt {
    id: string;
    echipamentId: string;
    angajatId: string;
    tip: string;
    type?: string;
    finalized?: boolean;
    echipament?: unknown;
  }

  const schimbari = (await prisma.equipmentChange.findMany({
    where: {
      angajatId,
      finalized: false,
    },
    include: { echipament: true },
  })) as SchimbareExt[];

  if (!schimbari.length) return null;

  // Split changes by type (assuming PREDAT for returned, PRIMIT for received)
  const echipamentePredateIds = schimbari
    .filter((s) => s.type === "PREDAT")
    .map((s) => s.echipamentId);

  // @ts-ignore
  const echipamentePrimiteIds = schimbari
    // @ts-ignore
    .filter((s) => s.type === "PRIMIT")
    .map((s: any) => s.echipamentId);

  let tip: ProcesVerbalTip = ProcesVerbalTip.PREDARE_PRIMIRE;
  if (echipamentePredateIds.length && echipamentePrimiteIds.length) {
    tip = ProcesVerbalTip.SCHIMB;
  } else if (echipamentePredateIds.length) {
    tip = ProcesVerbalTip.RESTITUIRE;
  }

  const rezultat = await creeazaProcesVerbalCuEchipamente(
    angajatId,
    null,
    tip,
    undefined,
    echipamentePredateIds,
    echipamentePrimiteIds
  );

  if (!rezultat) return null;

  const { procesVerbal, echipamentePredate, echipamentePrimite } = rezultat;

  const pdfBuffer = await genereazaPDFProcesVerbal({
    angajat: procesVerbal.angajat,
    echipamente: procesVerbal.echipamente,
    echipamentePredate,
    echipamentePrimite,
    observatii: procesVerbal.observatii || "-",
    tip: procesVerbal.tip,
    data: new Date().toLocaleDateString("ro-RO"),
    firma: "Creative & Innovative Management SRL",
  });

  return {
    pdfBuffer,
    schimbariIds: schimbari.map((s) => s.id),
    procesVerbalId: procesVerbal.id,
  };
};
