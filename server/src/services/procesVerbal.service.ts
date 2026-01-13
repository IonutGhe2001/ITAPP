import { ProcesVerbalTip } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { genereazaPDFProcesVerbal } from "../utils/pdfGenerator";

const EQUIPMENT_CHANGE_TYPE = {
  ASSIGN: "ASSIGN",
  RETURN: "RETURN",
  REPLACE: "REPLACE",
} as const;

type EquipmentChangeTypeValue =
  (typeof EQUIPMENT_CHANGE_TYPE)[keyof typeof EQUIPMENT_CHANGE_TYPE];

type EquipmentChangeWithEchipament = {
  id: string;
  echipamentId: string;
  tip: EquipmentChangeTypeValue;
  echipament: unknown;
};

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
  const schimbari: EquipmentChangeWithEchipament[] =
    await prisma.equipmentChange.findMany({
      where: {
        angajatId,
        includedInPV: false,
      },
      include: { echipament: true },
    });

  if (!schimbari.length) return null;

  const echipamentePredateIds = schimbari
    .filter((schimbare) => schimbare.tip === EQUIPMENT_CHANGE_TYPE.RETURN)
    .map((schimbare) => schimbare.echipamentId);

  const echipamentePrimiteIds = schimbari
    .filter(
      (schimbare) =>
        schimbare.tip === EQUIPMENT_CHANGE_TYPE.ASSIGN ||
        schimbare.tip === EQUIPMENT_CHANGE_TYPE.REPLACE
    )
    .map((schimbare) => schimbare.echipamentId);

  const hasReplace = schimbari.some(
    (schimbare) => schimbare.tip === EQUIPMENT_CHANGE_TYPE.REPLACE
  );

  let tip: ProcesVerbalTip = ProcesVerbalTip.PREDARE_PRIMIRE;
  if (echipamentePredateIds.length && echipamentePrimiteIds.length) {
    tip = ProcesVerbalTip.SCHIMB;
  } else if (echipamentePredateIds.length) {
    tip = ProcesVerbalTip.RESTITUIRE;
  } else if (hasReplace) {
    tip = ProcesVerbalTip.SCHIMB;
  }

  const uniquePredateIds = Array.from(new Set(echipamentePredateIds));
  const uniquePrimiteIds = Array.from(new Set(echipamentePrimiteIds));

  const rezultat = await creeazaProcesVerbalCuEchipamente(
    angajatId,
    null,
    tip,
    undefined,
    uniquePredateIds,
    uniquePrimiteIds
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
    schimbariIds: schimbari.map((schimbare) => schimbare.id),
    procesVerbalId: procesVerbal.id,
  };
};
