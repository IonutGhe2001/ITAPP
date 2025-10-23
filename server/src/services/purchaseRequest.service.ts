import { prisma } from "../lib/prisma";
import { EQUIPMENT_STATUS } from "@shared/equipmentStatus";
import type { PrismaClient } from "@prisma/client";
type PurchaseRequestStatus = "PENDING" | "ORDERED" | "DELIVERED";

export const createPurchaseRequest = (data: {
  equipmentType: string;
  quantity: number;
}) => {
  return prisma.purchaseRequest.create({ data });
};

export const getPurchaseRequests = () => {
  return prisma.purchaseRequest.findMany({ orderBy: { createdAt: "desc" } });
};

export const updatePurchaseRequestStatus = (
  id: string,
  status: PurchaseRequestStatus
) => {
  return prisma.$transaction(async (tx: PrismaClient) => {
    const request = await tx.purchaseRequest.findUnique({ where: { id } });
    if (!request) throw new Error("Cerere inexistentă");

    const updated = await tx.purchaseRequest.update({
      where: { id },
      data: { status },
    });

    if (status === "DELIVERED" && request.status !== "DELIVERED") {
      const equipments = Array.from({ length: request.quantity }, (_, index) => ({
        nume: request.equipmentType,
        tip: request.equipmentType,
        serie: `${request.id}-${index + 1}`,
        stare: EQUIPMENT_STATUS.IN_STOC,
      }));

      if (equipments.length > 0) {
        await tx.echipament.createMany({ data: equipments });
      }
    }

    return updated;
  });
};
