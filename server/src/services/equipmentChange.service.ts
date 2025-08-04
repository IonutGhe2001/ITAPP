import { prisma } from "../lib/prisma";

export const getUnsyncedChanges = (angajatId: string) => {
  return prisma.equipmentChange.findMany({
    where: { angajatId, includedInPV: false },
    orderBy: { createdAt: "asc" },
  });
};
