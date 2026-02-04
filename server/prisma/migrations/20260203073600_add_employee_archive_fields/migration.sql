-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('PROCES_VERBAL', 'CONTRACT_ANGAJARE', 'CONTRACT_MUNCA', 'CERTIFICAT', 'DIPLOMA', 'EVALUARE', 'AVERTISMENT', 'DECIZIE', 'CERERE', 'ALTA_CORESPONDENTA', 'OTHER');

-- AlterTable
ALTER TABLE "Angajat" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "archivedAt" TIMESTAMP(3),
ADD COLUMN "archivedBy" TEXT;

-- AlterTable
ALTER TABLE "AngajatDocument" ADD COLUMN "documentType" "DocumentType" NOT NULL DEFAULT 'OTHER',
ADD COLUMN "uploadYear" INTEGER;

-- Update existing records to set uploadYear from createdAt
UPDATE "AngajatDocument" SET "uploadYear" = EXTRACT(YEAR FROM "createdAt")::INTEGER WHERE "uploadYear" IS NULL;

-- Make uploadYear NOT NULL after populating existing records
ALTER TABLE "AngajatDocument" ALTER COLUMN "uploadYear" SET NOT NULL;

-- CreateTable
CREATE TABLE "DocumentAccessLog" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "userEmail" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "action" TEXT NOT NULL DEFAULT 'VIEW',
    "ipAddress" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentAccessLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DocumentAccessLog" ADD CONSTRAINT "DocumentAccessLog_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "AngajatDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;
