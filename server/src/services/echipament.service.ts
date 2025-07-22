import { prisma } from "../lib/prisma";


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
    stare?: string;
    angajatId?: string | null;
  }
) => {
return prisma.echipament.update({
  where: { id },
  data: {
    ...(data.nume !== undefined && { nume: data.nume }),
    ...(data.tip !== undefined && { tip: data.tip }),
    ...(data.serie !== undefined && { serie: data.serie }),
    ...(data.stare !== undefined && { stare: data.stare }),
    ...(data.angajatId !== undefined && { angajatId: data.angajatId }),
  },
  include: {
    angajat: true, 
  },
});
};

export const deleteEchipament = (id: string) => {
  return prisma.echipament.delete({ where: { id } });
};
