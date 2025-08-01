import { prisma } from "../lib/prisma";

export const getAngajati = () => {
  return prisma.angajat.findMany({
    select: {
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
    },
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
    dataAngajare?: Date 
    cDataUsername?: string;
    cDataId?: string;
    cDataNotes?: string;
    cDataCreated?: boolean;
  }
) => {
  const updateData: any = { ...data };
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
 return prisma.$transaction(async (tx: any) => {
    const echipamente = await tx.echipament.findMany({
      where: { angajatId: id },
      select: { id: true },
    });

    if (echipamente.length) {
      await tx.echipament.updateMany({
        where: { angajatId: id },
        data: { angajatId: null, stare: "in_stoc" },
      });

      if (tx.equipmentChange) {
        await tx.equipmentChange.createMany({
          data: echipamente.map((eq: { id: string }) => ({
            angajatId: id,
            echipamentId: eq.id,
            tip: 'RETURN',
          })),
        });
      }
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