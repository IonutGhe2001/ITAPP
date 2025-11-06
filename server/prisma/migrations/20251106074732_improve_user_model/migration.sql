-- DropIndex
DROP INDEX "public"."Angajat_cDataId_trgm_idx";

-- DropIndex
DROP INDEX "public"."Angajat_cDataUsername_trgm_idx";

-- DropIndex
DROP INDEX "public"."Angajat_email_trgm_idx";

-- DropIndex
DROP INDEX "public"."Angajat_functie_trgm_idx";

-- DropIndex
DROP INDEX "public"."Angajat_numeComplet_trgm_idx";

-- DropIndex
DROP INDEX "public"."Angajat_telefon_trgm_idx";

-- DropIndex
DROP INDEX "public"."Echipament_nume_trgm_idx";

-- DropIndex
DROP INDEX "public"."Echipament_serie_trgm_idx";

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "departament" TEXT,
ADD COLUMN     "lastLogin" TIMESTAMP(3),
ADD COLUMN     "locatie" TEXT;
