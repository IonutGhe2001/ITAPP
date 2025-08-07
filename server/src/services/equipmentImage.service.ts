import { prisma } from "../lib/prisma";

export const getEquipmentImages = (echipamentId: string) =>
  prisma.equipmentImage.findMany({ where: { echipamentId } });

export const getEquipmentImage = (id: string) =>
  prisma.equipmentImage.findUnique({ where: { id } });

export const addEquipmentImage = (echipamentId: string, url: string) =>
  prisma.equipmentImage.create({
    data: { echipamentId, url },
  });

export const deleteEquipmentImage = (id: string) =>
  prisma.equipmentImage.delete({ where: { id } });