-- CreateEnum
CREATE TYPE "public"."PurchaseRequestStatus" AS ENUM ('PENDING', 'ORDERED', 'DELIVERED');

-- CreateTable
CREATE TABLE "public"."PurchaseRequest" (
    "id" TEXT NOT NULL,
    "equipmentType" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" "public"."PurchaseRequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PurchaseRequest_pkey" PRIMARY KEY ("id")
);
