/*
  Warnings:

  - A unique constraint covering the columns `[serie]` on the table `Echipament` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Echipament_serie_key" ON "Echipament"("serie");
