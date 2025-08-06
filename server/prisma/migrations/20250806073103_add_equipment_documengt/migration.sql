-- AlterTable
ALTER TABLE "public"."Echipament" ADD COLUMN     "cpu" TEXT,
ADD COLUMN     "dataAchizitie" TIMESTAMP(3),
ADD COLUMN     "garantie" TIMESTAMP(3),
ADD COLUMN     "numarInventar" TEXT,
ADD COLUMN     "os" TEXT,
ADD COLUMN     "ram" TEXT,
ADD COLUMN     "stocare" TEXT,
ADD COLUMN     "versiuneFirmware" TEXT;

-- CreateTable
CREATE TABLE "public"."EquipmentDocument" (
    "id" TEXT NOT NULL,
    "echipamentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EquipmentDocument_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."EquipmentDocument" ADD CONSTRAINT "EquipmentDocument_echipamentId_fkey" FOREIGN KEY ("echipamentId") REFERENCES "public"."Echipament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
