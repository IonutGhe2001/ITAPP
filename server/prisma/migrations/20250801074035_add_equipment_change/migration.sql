-- CreateEnum
CREATE TYPE "public"."EquipmentChangeType" AS ENUM ('ASSIGN', 'RETURN', 'REPLACE');

-- CreateTable
CREATE TABLE "public"."EquipmentChange" (
    "id" TEXT NOT NULL,
    "angajatId" TEXT NOT NULL,
    "echipamentId" TEXT NOT NULL,
    "tip" "public"."EquipmentChangeType" NOT NULL,
    "includedInPV" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EquipmentChange_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."EquipmentChange" ADD CONSTRAINT "EquipmentChange_angajatId_fkey" FOREIGN KEY ("angajatId") REFERENCES "public"."Angajat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EquipmentChange" ADD CONSTRAINT "EquipmentChange_echipamentId_fkey" FOREIGN KEY ("echipamentId") REFERENCES "public"."Echipament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
