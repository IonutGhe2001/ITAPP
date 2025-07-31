import { prisma } from "../lib/prisma";
import { ProcesVerbalTip } from "@prisma/client";


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

  const idsToConnect = (echipamentIds
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

  return { procesVerbal, echipamentePredate, echipamentePrimite };
};
