import { prisma } from "../lib/prisma";


export const getEvenimenteByUser = (userId: number) => {
  return prisma.eveniment.findMany({ where: { userId } });
};

export const createEveniment = (data: {
  titlu: string;
  data: Date;
  ora: string;
  userId: number;
  recurrence?: string;
}) => {
   return prisma.eveniment.create({
    data: {
      ...data,
      recurrence: data.recurrence ?? "none",
    },
  });
};

export const updateEveniment = async (
  id: number,
  userId: number,
  data: { titlu?: string; ora?: string; data?: Date; recurrence?: string }
) => {
  const eveniment = await prisma.eveniment.findUnique({ where: { id } });
  if (!eveniment || eveniment.userId !== userId) return null;

  return prisma.eveniment.update({
    where: { id },
    data: {
      ...data,
      ...(data.recurrence !== undefined && { recurrence: data.recurrence }),
    },
  });
};

export const deleteEveniment = async (id: number, userId: number) => {
  const eveniment = await prisma.eveniment.findUnique({ where: { id } });
  if (!eveniment || eveniment.userId !== userId) return false;

  await prisma.eveniment.delete({ where: { id } });
  return true;
};
