import { prisma } from "../lib/prisma";
// Proces verbal generation is handled separately; avoid importing related services here
import { EQUIPMENT_STATUS } from "@shared/equipmentStatus";
import type { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

type TransactionClient = Pick<
  PrismaClient,
  "echipament" | "equipmentChange" | "equipmentDocument" | "equipmentImage"
>;

type Echipament = NonNullable<
  Awaited<ReturnType<typeof prisma.echipament.findUnique>>
>;

type JsonValue = unknown;

const validateEchipamentUpdate = async (
  tx: TransactionClient,
  id: string,
  current: Echipament,
  data: { tip?: string; serie?: string; angajatId?: string | null }
) => {
  const newTip = data.tip ?? current.tip;
  const newSerie = data.serie ?? current.serie;

  if (newTip !== current.tip || newSerie !== current.serie) {
    const duplicate = await tx.echipament.findFirst({
      where: { tip: newTip, serie: newSerie, NOT: { id } },
    });
    if (duplicate) {
      const error = new Error(
        "Există deja un echipament cu această serie pentru acest tip."
      ) as Error & { status?: number };
      error.status = 409;
      throw error;
    }
  }

  if (data.angajatId) {
    const eqSameType = await tx.echipament.findFirst({
      where: { angajatId: data.angajatId, tip: newTip, NOT: { id } },
    });
    if (eqSameType) {
      const error = new Error(
        "Angajatul are deja un echipament de acest tip."
      ) as Error & { status?: number };
      error.status = 409;
      throw error;
    }
  }
};

type EchipamentWithAngajat = Awaited<
  ReturnType<typeof prisma.echipament.findMany>
>[number] & { angajat: NonNullable<Awaited<
      ReturnType<typeof prisma.angajat.findMany>
    >[number]> | null };

export type GetEchipamenteParams = {
  page: number;
  pageSize: number;
  search?: string | null;
  status?: string | null;
  type?: string | null;
  sort: "asc" | "desc";
  sortBy: "nume" | "createdAt" | "tip" | "stare";
};

export function getEchipamente(): Promise<EchipamentWithAngajat[]>;
export function getEchipamente(
  params: GetEchipamenteParams
): Promise<{ items: EchipamentWithAngajat[]; total: number }>;
export async function getEchipamente(
  params?: GetEchipamenteParams
): Promise<EchipamentWithAngajat[] | { items: EchipamentWithAngajat[]; total: number }> {
  if (!params) {
    return prisma.echipament.findMany({ include: { angajat: true } });
  }

  const { page, pageSize, search, status, type, sort, sortBy } = params;
  const normalizedType = type?.trim();
  const searchTerm = search?.trim();
  
    const where = {
    ...(status ? { stare: status.toLowerCase() } : {}),
    ...(normalizedType
      ? { tip: { equals: normalizedType, mode: "insensitive" } }
      : {}),
    ...(searchTerm
      ? {
          OR: [
            { nume: { contains: searchTerm, mode: "insensitive" } },
            { serie: { contains: searchTerm, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const skip = (page - 1) * pageSize;
  const orderBy =
    sortBy === "createdAt"
      ? { createdAt: sort }
      : sortBy === "tip"
        ? { tip: sort }
        : sortBy === "stare"
          ? { stare: sort }
          : { nume: sort };

  const [items, total] = await prisma.$transaction([
    prisma.echipament.findMany({
      where,
      include: { angajat: true },
      skip,
      take: pageSize,
      orderBy,
    }),
    prisma.echipament.count({ where }),
  ]);

  return { items, total };
}

// Fetch a single equipment entry along with its assigned employee
export const getEchipament = async (id: string) => {
  const echipament = await prisma.echipament.findUnique({
    where: { id },
    include: { angajat: true, documents: true, images: true },
  });

  if (!echipament) return echipament;

  const now = new Date();
  const meta: {
    warrantyDaysLeft?: number;
    warrantyExpired?: boolean;
    ageYears?: number;
    defectDays?: number;
  } = {};

  if (echipament.garantie) {
    const garantieDate = new Date(echipament.garantie);
    meta.warrantyDaysLeft = Math.ceil(
      (garantieDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    meta.warrantyExpired = meta.warrantyDaysLeft < 0;
  }

  if (echipament.dataAchizitie) {
    const achizitieDate = new Date(echipament.dataAchizitie);
    meta.ageYears = Math.floor(
      (now.getTime() - achizitieDate.getTime()) / (1000 * 60 * 60 * 24 * 365)
    );
  }

  if (echipament.stare === EQUIPMENT_STATUS.MENTENANTA && echipament.defectAt) {
    const defectDate = new Date(echipament.defectAt);
    meta.defectDays = Math.floor(
      (now.getTime() - defectDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  return { ...echipament, meta };
};

export const createEchipament = (data: {
  nume: string;
  tip: string;
  stare?: string;
  serie: string;
  angajatId?: string | null;
  cpu?: string;
  ram?: string;
  stocare?: string;
  os?: string;
  versiuneFirmware?: string;
  numarInventar?: string;
  dataAchizitie?: Date | string;
  garantie?: Date | string;
  metadata?: JsonValue;
}) => {
  const finalStare = data.stare
    ? data.stare
    : data.angajatId
      ? "alocat"
      : "in_stoc";

  return prisma.$transaction(async (tx: TransactionClient) => {
    const existing = await tx.echipament.findFirst({
      where: { tip: data.tip, serie: data.serie },
    });
    if (existing) {
      const error = new Error(
        "Există deja un echipament cu această serie pentru acest tip."
      ) as Error & { status?: number };
      error.status = 409;
      throw error;
    }

    if (data.angajatId) {
      const eqSameType = await tx.echipament.findFirst({
        where: { angajatId: data.angajatId, tip: data.tip },
      });
      if (eqSameType) {
        const error = new Error(
          "Angajatul are deja un echipament de acest tip."
        ) as Error & { status?: number };
        error.status = 409;
        throw error;
      }
    }

    const echipament = await tx.echipament.create({
      data: {
        ...data,
        stare: finalStare,
      },
    });

    if (echipament.angajatId && tx.equipmentChange) {
      await tx.equipmentChange.create({
        data: {
          angajatId: echipament.angajatId,
          echipamentId: echipament.id,
          tip: "ASSIGN",
        },
      });
    }

    return echipament;
  });
};

export const updateEchipament = async (
  id: string,
  data: {
    nume?: string;
    tip?: string;
    serie?: string;
    stare?: string;
    angajatId?: string | null;
    metadata?: JsonValue;
    cpu?: string;
    ram?: string;
    stocare?: string;
    os?: string;
    versiuneFirmware?: string;
    numarInventar?: string;
    dataAchizitie?: Date | string;
    garantie?: Date | string;
  }
) => {
  return prisma.$transaction(async (tx: TransactionClient) => {
    const current = await tx.echipament.findUnique({ where: { id } });
    if (!current) throw new Error("Echipament inexistent");

    await validateEchipamentUpdate(tx, id, current, data);

    const updateData: Record<string, any> = {
      ...(data.nume !== undefined && { nume: data.nume }),
      ...(data.tip !== undefined && { tip: data.tip }),
      ...(data.serie !== undefined && { serie: data.serie }),
      ...(data.angajatId !== undefined && { angajatId: data.angajatId }),
      ...(data.metadata !== undefined && { metadata: data.metadata }),
      ...(data.cpu !== undefined && { cpu: data.cpu }),
      ...(data.ram !== undefined && { ram: data.ram }),
      ...(data.stocare !== undefined && { stocare: data.stocare }),
      ...(data.os !== undefined && { os: data.os }),
      ...(data.versiuneFirmware !== undefined && {
        versiuneFirmware: data.versiuneFirmware,
      }),
      ...(data.numarInventar !== undefined && {
        numarInventar: data.numarInventar,
      }),
      ...(data.dataAchizitie !== undefined && {
        dataAchizitie: data.dataAchizitie,
      }),
      ...(data.garantie !== undefined && { garantie: data.garantie }),
    };

    if (data.stare !== undefined) {
      updateData.stare = data.stare;
      if (
        data.stare === EQUIPMENT_STATUS.MENTENANTA &&
        current.stare !== EQUIPMENT_STATUS.MENTENANTA
      ) {
        updateData.defectAt = new Date();
      } else if (
        current.stare === EQUIPMENT_STATUS.MENTENANTA &&
        data.stare !== EQUIPMENT_STATUS.MENTENANTA
      ) {
        updateData.defectAt = null;
      }
      } else if (data.angajatId !== undefined) {
      updateData.stare = data.angajatId
        ? EQUIPMENT_STATUS.ALOCAT
        : EQUIPMENT_STATUS.IN_STOC;
      if (
        current.stare === EQUIPMENT_STATUS.MENTENANTA &&
        updateData.stare !== EQUIPMENT_STATUS.MENTENANTA
      ) {
        updateData.defectAt = null;
      }
    }

    const updated = await tx.echipament.update({
      where: { id },
      data: updateData,
      include: {
        angajat: true,
      },
    });

    if (tx.equipmentChange) {
      if (
        data.angajatId !== undefined &&
        data.angajatId !== current.angajatId
      ) {
        if (current.angajatId && data.angajatId) {
          await tx.equipmentChange.create({
            data: {
              angajatId: current.angajatId,
              echipamentId: id,
              tip: "RETURN",
            },
          });
          await tx.equipmentChange.create({
            data: {
              angajatId: data.angajatId,
              echipamentId: id,
              tip: "ASSIGN",
            },
          });
        } else if (current.angajatId && !data.angajatId) {
          await tx.equipmentChange.create({
            data: {
              angajatId: current.angajatId,
              echipamentId: id,
              tip: "RETURN",
            },
          });
        } else if (!current.angajatId && data.angajatId) {
          await tx.equipmentChange.create({
            data: {
              angajatId: data.angajatId,
              echipamentId: id,
              tip: "ASSIGN",
            },
          });
        }
      } else if (
        (data.tip && data.tip !== current.tip) ||
        (data.serie && data.serie !== current.serie)
      ) {
        if (current.angajatId) {
          await tx.equipmentChange.create({
            data: {
              angajatId: current.angajatId,
              echipamentId: id,
              tip: "REPLACE",
            },
          });
        }
      }
    }

    return updated;
  });
};

export const deleteEchipament = (id: string) => {
  return prisma.$transaction(async (tx: TransactionClient) => {
    const docs = await tx.equipmentDocument.findMany({
      where: { echipamentId: id },
    });
    for (const doc of docs) {
      const filePath = path.join(__dirname, "../../public", doc.path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    await tx.equipmentDocument.deleteMany({ where: { echipamentId: id } });

    const images = await tx.equipmentImage.findMany({
      where: { echipamentId: id },
    });
    for (const image of images) {
      const filePath = path.join(__dirname, "../../public", image.url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    await tx.equipmentImage.deleteMany({ where: { echipamentId: id } });

    await tx.equipmentChange.deleteMany({ where: { echipamentId: id } });

    return tx.echipament.delete({ where: { id } });
  });
};

export const getStats = async () => {
  const [echipamente, grouped, angajati] = await Promise.all([
    prisma.echipament.count(),
    prisma.echipament.groupBy({
      by: ["stare"],
      _count: { stare: true },
    }),
    prisma.angajat.count(),
  ]);

  const counts: Record<string, number> = Object.values(EQUIPMENT_STATUS).reduce(
    (acc, status) => {
      acc[status] = 0;
      return acc;
    },
    {} as Record<string, number>
  );

  grouped.forEach(
    ({ stare, _count }: { stare: string; _count: { stare: number } }) => {
      counts[stare] = _count.stare;
    }
  );
  return {
    echipamente,
    ...counts,
    angajati,
  };
};

export const getAvailableStock = async () => {
  const types = ["Laptop", "Telefon", "SIM"];
  const stock: Record<string, Echipament[]> = {};
  for (const t of types) {
    stock[t] = await prisma.echipament.findMany({
      where: { tip: t, stare: "in_stoc" },
    });
  }
  return stock;
};

export const orderEchipament = (tip: string) => {
  return prisma.echipament.create({
    data: {
      nume: `${tip} nou`,
      tip,
      serie: `order-${Date.now()}`,
      stare: "in_comanda",
    },
  });
};
