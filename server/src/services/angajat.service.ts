import { prisma } from "../lib/prisma";
import type { Prisma, PrismaClient, EmailAccountStatus } from "@prisma/client";

const angajatSelect = {
  id: true,
  numeComplet: true,
  functie: true,
  dataAngajare: true,
  email: true,
  telefon: true,
  departmentConfigId: true,
  checklist: true,
  licenses: true,
  cDataUsername: true,
  cDataId: true,
  cDataNotes: true,
  cDataCreated: true,
  emailAccountStatus: true,
  emailAccountCreatedAt: true,
  emailAccountResponsible: true,
  emailAccountLink: true,
  echipamente: {
    where: {
      angajatId: {
        not: null,
      },
    },
    select: {
      id: true,
      nume: true,
      tip: true,
      serie: true,
      stare: true,
    },
  },
} satisfies Prisma.AngajatSelect;

export interface GetAngajatiParams {
  page: number;
  pageSize: number;
  department?: string;
  status?: EmailAccountStatus;
}

export const getAngajati = async ({
  page,
  pageSize,
  department,
  status,
}: GetAngajatiParams) => {
  const where: Prisma.AngajatWhereInput = {
    ...(department ? { departmentConfigId: department } : {}),
    ...(status ? { emailAccountStatus: status } : {}),
  };

  const [total, angajati] = await prisma.$transaction([
    prisma.angajat.count({ where }),
    prisma.angajat.findMany({
      where,
      select: angajatSelect,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { numeComplet: "asc" },
    }),
  ]);

  const totalPages = pageSize > 0 ? Math.ceil(total / pageSize) : 0;
  const hasMore = pageSize > 0 ? page * pageSize < total : false;

  return {
    data: angajati,
    total,
    page,
    pageSize,
    totalPages,
    hasMore,
  };
};

export const getAllAngajati = () => {
  return prisma.angajat.findMany({
    select: angajatSelect,
    orderBy: { numeComplet: "asc" },
  });
};

export const createAngajat = async (data: {
  numeComplet: string;
  functie: string;
  email?: string;
  telefon?: string;
  departmentConfigId?: string;
  dataAngajare?: Date;
  cDataUsername?: string;
  cDataId?: string;
  cDataNotes?: string;
  cDataCreated?: boolean;
}) => {
  let checklist: string[] = [];
  let licenses: string[] = [];
  if (data.departmentConfigId) {
    const config = await prisma.departmentConfig.findUnique({
      where: { id: data.departmentConfigId },
    });
    if (config) {
      checklist = config.defaultRequirements;
      licenses = config.defaultLicenses;
    }
  }
  return prisma.angajat.create({
    data: { ...data, checklist, licenses },
  });
};

export const updateAngajat = async (
  id: string,
  data: {
    numeComplet?: string;
    functie?: string;
    email?: string;
    telefon?: string;
    departmentConfigId?: string;
    dataAngajare?: Date;
    cDataUsername?: string;
    cDataId?: string;
    cDataNotes?: string;
    cDataCreated?: boolean;
  }
) => {
  const updateData: Record<string, unknown> = { ...data };
  if (data.departmentConfigId) {
    const config = await prisma.departmentConfig.findUnique({
      where: { id: data.departmentConfigId },
    });
    if (config) {
      updateData.checklist = config.defaultRequirements;
      updateData.licenses = config.defaultLicenses;
    }
  }
  return prisma.angajat.update({ where: { id }, data: updateData });
};

export const getAngajatById = (id: string) => {
  return prisma.angajat.findUnique({
    where: { id },
    select: {
      id: true,
      numeComplet: true,
      functie: true,
      email: true,
      telefon: true,
      departmentConfigId: true,
      checklist: true,
      licenses: true,
    },
  });
};

export const deleteAngajat = (id: string) => {
  return prisma.$transaction(async (tx: PrismaClient) => {
    const echipamente = await tx.echipament.findMany({
      where: { angajatId: id },
      select: { id: true },
    });

    if (echipamente.length) {
      await tx.echipament.updateMany({
        where: { angajatId: id },
        data: { angajatId: null, stare: "in_stoc" },
      });
    }

    if (tx.equipmentChange) {
      await tx.equipmentChange.deleteMany({
        where: { angajatId: id },
      });
    }

    await tx.angajat.delete({ where: { id } });
  });
};

export const createEmailAccount = (
  id: string,
  data: { email: string; responsible: string; link?: string }
) => {
  return prisma.angajat.update({
    where: { id },
    data: {
      email: data.email,
      emailAccountStatus: "CREATED",
      emailAccountCreatedAt: new Date(),
      emailAccountResponsible: data.responsible,
      emailAccountLink: data.link,
    },
  });
};
