import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getEchipamente = () => {
  return prisma.echipament.findMany();
};

export const createEchipament = (data: {
  nume: string;
  tip: string;
  stare?: string; 
  serie: string;
  angajatId?: string | null;
}) => {
  const finalStare = data.angajatId ? "asignat" : "disponibil";

  return prisma.echipament.create({
    data: {
      ...data,
      stare: finalStare,
    },
  });
};

export const updateEchipament = (
  id: string,
  data: {
    nume?: string;
    tip?: string;
    serie?: string;
    angajatId?: string | null;
  }
) => {
  return prisma.echipament.update({
    where: { id },
    data: {
      nume: data.nume ?? undefined,
      tip: data.tip ?? undefined,
      serie: data.serie ?? undefined,
      angajatId: data.angajatId ?? undefined,
    },
  });
};

export const deleteEchipament = (id: string) => {
  return prisma.echipament.delete({ where: { id } });
};
