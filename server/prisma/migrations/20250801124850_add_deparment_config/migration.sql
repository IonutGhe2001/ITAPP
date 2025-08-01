-- AlterTable
ALTER TABLE "public"."Angajat" ADD COLUMN     "checklist" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "departmentConfigId" TEXT,
ADD COLUMN     "licenses" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "public"."DepartmentConfig" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "defaultLicenses" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "defaultRequirements" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "DepartmentConfig_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Angajat" ADD CONSTRAINT "Angajat_departmentConfigId_fkey" FOREIGN KEY ("departmentConfigId") REFERENCES "public"."DepartmentConfig"("id") ON DELETE SET NULL ON UPDATE CASCADE;
