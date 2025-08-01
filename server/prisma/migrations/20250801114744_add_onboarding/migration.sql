-- CreateTable
CREATE TABLE "public"."Onboarding" (
    "id" TEXT NOT NULL,
    "angajatId" TEXT,
    "department" TEXT NOT NULL,
    "laptopId" TEXT NOT NULL,
    "tasks" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Onboarding_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Onboarding" ADD CONSTRAINT "Onboarding_angajatId_fkey" FOREIGN KEY ("angajatId") REFERENCES "public"."Angajat"("id") ON DELETE SET NULL ON UPDATE CASCADE;
