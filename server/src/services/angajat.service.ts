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

export const createAngajat = (data: {
  numeComplet: string;
  functie: string;
  email?: string;
  telefon?: string;
  dataAngajare?: Date;
  cDataUsername?: string;
  cDataId?: string;
  cDataNotes?: string;
  cDataCreated?: boolean;
}) => {
  return prisma.angajat.create({ data });
};

export const updateAngajat = (
  id: string,
  data: {
    numeComplet?: string;
    functie?: string;
    email?: string;
    telefon?: string;
    dataAngajare?: Date 
    cDataUsername?: string;
    cDataId?: string;
    cDataNotes?: string;
    cDataCreated?: boolean;
  }
) => {
  return prisma.angajat.update({ where: { id }, data });
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