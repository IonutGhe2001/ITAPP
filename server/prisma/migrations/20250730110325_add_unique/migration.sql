/*
  Warnings:

  - A unique constraint covering the columns `[tip,serie]` on the table `Echipament` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Echipament_serie_key";

-- CreateIndex
CREATE UNIQUE INDEX "Echipament_tip_serie_key" ON "Echipament"("tip", "serie");
