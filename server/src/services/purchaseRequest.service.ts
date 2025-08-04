import { prisma } from "../lib/prisma";
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
  return prisma.$transaction(async (tx: any) => {
    const request = await tx.purchaseRequest.findUnique({ where: { id } });
    if (!request) throw new Error("Cerere inexistentă");

    const updated = await tx.purchaseRequest.update({
      where: { id },
      data: { status },
    });

    if (status === "DELIVERED" && request.status !== "DELIVERED") {
      for (let i = 0; i < request.quantity; i++) {
        await tx.echipament.create({
          data: {
            nume: request.equipmentType,
            tip: request.equipmentType,
            serie: `${request.id}-${i + 1}`,
            stare: "disponibil",
          },
        });
      }
    }

    return updated;
  });
};
