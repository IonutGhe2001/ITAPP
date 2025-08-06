import { prisma } from "../lib/prisma";

export const getUnsyncedChanges = (angajatId: string) => {
  return prisma.equipmentChange.findMany({
    where: { angajatId, includedInPV: false },
    orderBy: { createdAt: "asc" },
  });
};

export const getEquipmentHistory = (echipamentId: string) => {
  return prisma.equipmentChange.findMany({
    where: { echipamentId },
    include: { angajat: true },
    orderBy: { createdAt: "desc" },
  });
};