import { prisma } from "../lib/prisma";

export const getEquipmentImages = (echipamentId: string) =>
  prisma.equipmentImage.findMany({ where: { echipamentId } });

export const addEquipmentImage = (
  echipamentId: string,
  url: string,
) =>
  prisma.equipmentImage.create({
    data: { echipamentId, url },
  });