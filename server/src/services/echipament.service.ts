import { prisma } from "../lib/prisma";
// Proces verbal generation is handled separately; avoid importing related services here
import { EQUIPMENT_STATUS } from "@shared/equipmentStatus";

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
      ? "alocat"
      : "in_stoc";

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

    const echipament = await tx.echipament.create({
      data: {
        ...data,
        stare: finalStare,
      },
    });

    if (echipament.angajatId && tx.equipmentChange) {
      await tx.equipmentChange.create({
        data: {
          angajatId: echipament.angajatId,
          echipamentId: echipament.id,
          tip: "ASSIGN",
        },
      });
    }

    return echipament;
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

    const updated = await tx.echipament.update({
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

    if (tx.equipmentChange) {
      if (
        data.angajatId !== undefined &&
        data.angajatId !== current.angajatId
      ) {
        if (current.angajatId && data.angajatId) {
          await tx.equipmentChange.create({
            data: {
              angajatId: current.angajatId,
              echipamentId: id,
              tip: "RETURN",
            },
          });
          await tx.equipmentChange.create({
            data: {
              angajatId: data.angajatId,
              echipamentId: id,
              tip: "ASSIGN",
            },
          });
        } else if (current.angajatId && !data.angajatId) {
          await tx.equipmentChange.create({
            data: {
              angajatId: current.angajatId,
              echipamentId: id,
              tip: "RETURN",
            },
          });
        } else if (!current.angajatId && data.angajatId) {
          await tx.equipmentChange.create({
            data: {
              angajatId: data.angajatId,
              echipamentId: id,
              tip: "ASSIGN",
            },
          });
        }
      } else if (
        (data.tip && data.tip !== current.tip) ||
        (data.serie && data.serie !== current.serie)
      ) {
        if (current.angajatId) {
          await tx.equipmentChange.create({
            data: {
              angajatId: current.angajatId,
              echipamentId: id,
              tip: "REPLACE",
            },
          });
        }
      }
    }

    return updated;
  });
};

export const deleteEchipament = (id: string) => {
  return prisma.echipament.delete({ where: { id } });
};

export const getStats = async () => {
  const [echipamente, grouped, angajati] = await Promise.all([
    prisma.echipament.count(),
    prisma.echipament.groupBy({
      by: ["stare"],
      _count: { stare: true },
    }),
    prisma.angajat.count(),
  ]);

  const counts: Record<string, number> = Object.values(EQUIPMENT_STATUS).reduce(
    (acc, status) => {
      acc[status] = 0;
      return acc;
    },
    {} as Record<string, number>
  );

  grouped.forEach(
    ({ stare, _count }: { stare: string; _count: { stare: number } }) => {
      counts[stare] = _count.stare;
    }
  );
  return {
    echipamente,
    ...counts,
    angajati,
  };
};

export const getAvailableStock = async () => {
  const types = ["Laptop", "Telefon", "SIM"];
  const stock: Record<string, any[]> = {};
  for (const t of types) {
    stock[t] = await prisma.echipament.findMany({
      where: { tip: t, stare: "in_stoc" },
    });
  }
  return stock;
};

export const orderEchipament = (tip: string) => {
  return prisma.echipament.create({
    data: {
      nume: `${tip} nou`,
      tip,
      serie: `order-${Date.now()}`,
      stare: "in_comanda",
    },
  });
};
