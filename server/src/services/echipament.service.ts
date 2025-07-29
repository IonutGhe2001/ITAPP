import { prisma } from "../lib/prisma";


export const getEchipamente = () => {
  return prisma.echipament.findMany({ include: { angajat: true } });
};

export const createEchipament = (data: {
  nume: string;
  tip: string;
  stare?: string; 
  serie: string;
  angajatId?: string | null;
  metadata?: any;
}) => {
  const finalStare = data.stare
    ? data.stare
    : data.angajatId
    ? "predat"
    : "disponibil";

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
    metadata?: any;
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
    ...(data.metadata !== undefined && { metadata: data.metadata }),
  },
  include: {
    angajat: true, 
  },
});
};

export const deleteEchipament = (id: string) => {
  return prisma.echipament.delete({ where: { id } });
};

export const getStats = async () => {
  const [echipamente, disponibile, predate, angajati] = await Promise.all([
    prisma.echipament.count(),
    prisma.echipament.count({ where: { stare: "disponibil" } }),
    prisma.echipament.count({ where: { angajatId: { not: null } } }),
    prisma.angajat.count(),
  ]);

  return { echipamente, disponibile, predate, angajati };
};