import { prisma } from "../lib/prisma";

export const getAngajati = () => {
  return prisma.angajat.findMany({
    select: {
      id: true,
      numeComplet: true,
      functie: true,
      email: true,
      telefon: true,
      echipamente: {
        where: {
          angajatId: {
            not: null,
          },
        },
        select: { 
          id: true,
          nume: true,
          tip: true,
          serie: true,
          stare: true,
        },
      },
    },
  });
};

export const createAngajat = (data: {
  numeComplet: string;
  functie: string;
  email?: string;
  telefon?: string;
}) => {
  return prisma.angajat.create({ data });
};

export const updateAngajat = (
  id: string,
  data: { numeComplet?: string; functie?: string; email?: string; telefon?: string }
) => {
  return prisma.angajat.update({ where: { id }, data });
};

export const deleteAngajat = (id: string) => {
 return prisma.$transaction(async (tx: any) => {
    const echipamente = await tx.echipament.findMany({
      where: { angajatId: id },
      select: { id: true },
    });

    if (echipamente.length) {
      await tx.echipament.updateMany({
        where: { angajatId: id },
        data: { angajatId: null, stare: "disponibil" },
      });

      if (tx.equipmentChange) {
        await tx.equipmentChange.createMany({
          data: echipamente.map((eq: { id: string }) => ({
            angajatId: id,
            echipamentId: eq.id,
            tip: 'RETURN',
          })),
        });
      }
    }

    await tx.angajat.delete({ where: { id } });
  });
};