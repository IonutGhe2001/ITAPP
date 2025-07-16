import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getEvenimenteByUser = (userId: number) => {
  return prisma.eveniment.findMany({ where: { userId } });
};

export const createEveniment = (data: {
  titlu: string;
  data: Date;
  ora: string;
  userId: number;
}) => {
  return prisma.eveniment.create({ data });
};

export const updateEveniment = async (
  id: number,
  userId: number,
  data: { titlu?: string; ora?: string; data?: Date }
) => {
  const eveniment = await prisma.eveniment.findUnique({ where: { id } });
  if (!eveniment || eveniment.userId !== userId) return null;

  return prisma.eveniment.update({ where: { id }, data });
};

export const deleteEveniment = async (id: number, userId: number) => {
  const eveniment = await prisma.eveniment.findUnique({ where: { id } });
  if (!eveniment || eveniment.userId !== userId) return false;

  await prisma.eveniment.delete({ where: { id } });
  return true;
};
