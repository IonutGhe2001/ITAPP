-- CreateTable
CREATE TABLE "public"."EquipmentImage" (
    "id" TEXT NOT NULL,
    "echipamentId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EquipmentImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."EquipmentImage" ADD CONSTRAINT "EquipmentImage_echipamentId_fkey" FOREIGN KEY ("echipamentId") REFERENCES "public"."Echipament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
