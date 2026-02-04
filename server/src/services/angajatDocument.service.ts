import { prisma } from "../lib/prisma";
import type { DocumentType } from "@prisma/client";

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
  uploadedBy?: string,
  documentType?: DocumentType,
  uploadYear?: number
) =>
  prisma.angajatDocument.create({
    data: { 
      angajatId, 
      name, 
      path, 
      type, 
      size, 
      uploadedBy,
      documentType: documentType || "OTHER",
      uploadYear: uploadYear || new Date().getFullYear(),
    },
  });

export const deleteAngajatDocument = (id: string) =>
  prisma.angajatDocument.delete({ where: { id } });

export const logDocumentAccess = (
  documentId: string,
  userId: number,
  userEmail: string,
  userName: string,
  action: string = "VIEW",
  ipAddress?: string
) =>
  prisma.documentAccessLog.create({
    data: {
      documentId,
      userId,
      userEmail,
      userName,
      action,
      ipAddress,
    },
  });

export interface SearchDocumentsParams {
  employeeName?: string;
  documentType?: DocumentType;
  uploadYear?: number;
  includeInactive?: boolean;
  page?: number;
  pageSize?: number;
}

export const searchDocuments = async ({
  employeeName,
  documentType,
  uploadYear,
  includeInactive = false,
  page = 1,
  pageSize = 50,
}: SearchDocumentsParams) => {
  const where: any = {};

  if (employeeName) {
    where.angajat = {
      numeComplet: {
        contains: employeeName,
        mode: "insensitive",
      },
      ...(includeInactive ? {} : { isActive: true }),
    };
  } else if (!includeInactive) {
    where.angajat = { isActive: true };
  }

  if (documentType) {
    where.documentType = documentType;
  }

  if (uploadYear) {
    where.uploadYear = uploadYear;
  }

  const [total, documents] = await prisma.$transaction([
    prisma.angajatDocument.count({ where }),
    prisma.angajatDocument.findMany({
      where,
      include: {
        angajat: {
          select: {
            id: true,
            numeComplet: true,
            functie: true,
            isActive: true,
            archivedAt: true,
          },
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    data: documents,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
};

export const getDocumentAccessLogs = (documentId: string) =>
  prisma.documentAccessLog.findMany({
    where: { documentId },
    orderBy: { timestamp: "desc" },
  });

export const getAvailableYears = async (): Promise<number[]> => {
  const documents = await prisma.angajatDocument.findMany({
    select: { uploadYear: true },
    distinct: ['uploadYear'],
    orderBy: { uploadYear: 'desc' },
  });
  
  return documents
    .map(doc => doc.uploadYear)
    .filter((year): year is number => year !== null && year !== undefined);
};
