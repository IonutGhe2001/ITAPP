import { prisma } from "../lib/prisma";
// Proces verbal generation is handled separately; avoid importing related services here

const validateEchipamentUpdate = async (
  tx: any,
  id: string,
  current: any,
  data: { tip?: string; serie?: string; angajatId?: string | null }
) => {
  const newTip = data.tip ?? current.tip;
  const newSerie = data.serie ?? current.serie;

  if (newTip !== current.tip || newSerie !== current.serie) {
    const duplicate = await tx.echipament.findFirst({
      where: { tip: newTip, serie: newSerie, NOT: { id } },
    });
    if (duplicate) {
      const error: any = new Error(
        "Există deja un echipament cu această serie pentru acest tip."
      );
      error.status = 409;
      throw error;
    }
  }

  if (data.angajatId) {
    const eqSameType = await tx.echipament.findFirst({
      where: { angajatId: data.angajatId, tip: newTip, NOT: { id } },
    });
    if (eqSameType) {
      const error: any = new Error(
        "Angajatul are deja un echipament de acest tip."
      );
      error.status = 409;
      throw error;
    }
  }
};

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

  return prisma.$transaction(async (tx: any) => {
    const existing = await tx.echipament.findFirst({
      where: { tip: data.tip, serie: data.serie },
    });
    if (existing) {
      const error: any = new Error(
        "Există deja un echipament cu această serie pentru acest tip."
      );
      error.status = 409;
      throw error;
    }

    if (data.angajatId) {
      const eqSameType = await tx.echipament.findFirst({
        where: { angajatId: data.angajatId, tip: data.tip },
      });
      if (eqSameType) {
        const error: any = new Error(
          "Angajatul are deja un echipament de acest tip."
        );
        error.status = 409;
        throw error;
      }
    }

    return tx.echipament.create({
      data: {
        ...data,
        stare: finalStare,
      },
    });
  });
};

export const updateEchipament = async (
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

  return prisma.$transaction(async (tx: any) => {
    const current = await tx.echipament.findUnique({ where: { id } });
    if (!current) throw new Error("Echipament inexistent");

    await validateEchipamentUpdate(tx, id, current, data);

    return tx.echipament.update({
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