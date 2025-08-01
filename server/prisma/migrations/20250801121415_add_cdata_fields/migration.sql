-- AlterTable
ALTER TABLE "public"."Angajat" ADD COLUMN     "cDataCreated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "cDataId" TEXT,
ADD COLUMN     "cDataNotes" TEXT,
ADD COLUMN     "cDataUsername" TEXT;
