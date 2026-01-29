import { prisma } from "../lib/prisma";

export const getAngajatDocuments = (angajatId: string) =>
  prisma.angajatDocument.findMany({ 
    where: { angajatId },
    orderBy: { createdAt: "desc" }
  });

export const getAngajatDocument = (id: string) =>
  prisma.angajatDocument.findUnique({ where: { id } });

export const addAngajatDocument = (
  angajatId: string,
  name: string,
  path: string,
  type?: string,
  size?: number,
  uploadedBy?: string
) =>
  prisma.angajatDocument.create({
    data: { angajatId, name, path, type, size, uploadedBy },
  });

export const deleteAngajatDocument = (id: string) =>
  prisma.angajatDocument.delete({ where: { id } });
