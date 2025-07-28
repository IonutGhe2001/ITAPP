import { prisma } from "../lib/prisma";

export const globalSearch = async (query: string) => {
  const q = query.trim();
  if (!q) return { echipamente: [], angajati: [] };

  const echipamente = await prisma.echipament.findMany({
    where: {
      OR: [
        { nume: { contains: q, mode: "insensitive" } },
        { serie: { contains: q, mode: "insensitive" } },
      ],
    },
    include: { angajat: true },
  });

  const angajati = await prisma.angajat.findMany({
    where: {
      OR: [
        { numeComplet: { contains: q, mode: "insensitive" } },
        { functie: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { telefon: { contains: q, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      numeComplet: true,
      functie: true,
      email: true,
      telefon: true,
    },
  });

  return { echipamente, angajati };
};