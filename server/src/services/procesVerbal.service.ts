import { prisma } from "../lib/prisma";


export const creeazaProcesVerbalCuEchipamente = async (angajatId: string, observatii?: string | null) => {
  const angajat = await prisma.angajat.findUnique({
    where: { id: angajatId },
    include: { echipamente: true },
  });

  if (!angajat) return null;

  const procesVerbal = await prisma.procesVerbal.create({
    data: {
      angajatId: angajat.id,
      observatii: observatii || null,
      echipamente: {
       connect: angajat.echipamente.map((eq: { id: string }) => ({ id: eq.id })),
      },
    },
    include: {
      echipamente: true,
      angajat: true,
    },
  });

  return procesVerbal;
};
