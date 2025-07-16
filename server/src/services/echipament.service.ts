import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getEchipamente = () => {
  return prisma.echipament.findMany();
};

export const createEchipament = (data: {
  nume: string;
  tip: string;
  stare: string;
  serie: string;
  angajatId?: string | null;
}) => {
  return prisma.echipament.create({ data });
};

export const updateEchipament = (id: string, data: { serie?: string }) => {
  return prisma.echipament.update({ where: { id }, data });
};

export const deleteEchipament = (id: string) => {
  return prisma.echipament.delete({ where: { id } });
};
