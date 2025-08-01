-- CreateEnum
CREATE TYPE "public"."EmailAccountStatus" AS ENUM ('PENDING', 'CREATED');

-- AlterTable
ALTER TABLE "public"."Angajat" ADD COLUMN     "emailAccountCreatedAt" TIMESTAMP(3),
ADD COLUMN     "emailAccountLink" TEXT,
ADD COLUMN     "emailAccountResponsible" TEXT,
ADD COLUMN     "emailAccountStatus" "public"."EmailAccountStatus" NOT NULL DEFAULT 'PENDING';
