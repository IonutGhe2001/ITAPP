import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAngajati = () => {
  return prisma.angajat.findMany({
    select: { id: true, numeComplet: true },
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

export const updateAngajat = (id: string, data: { email?: string; telefon?: string }) => {
  return prisma.angajat.update({ where: { id }, data });
};

export const deleteAngajat = (id: string) => {
  return prisma.angajat.delete({ where: { id } });
};