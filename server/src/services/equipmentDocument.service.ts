import { prisma } from "../lib/prisma";

export const getEquipmentDocuments = (echipamentId: string) =>
  prisma.equipmentDocument.findMany({ where: { echipamentId } });

export const getEquipmentDocument = (id: string) =>
  prisma.equipmentDocument.findUnique({ where: { id } });

export const addEquipmentDocument = (
  echipamentId: string,
  name: string,
  path: string
) =>
  prisma.equipmentDocument.create({
    data: { echipamentId, name, path },
  });

export const deleteEquipmentDocument = (id: string) =>
  prisma.equipmentDocument.delete({ where: { id } });
