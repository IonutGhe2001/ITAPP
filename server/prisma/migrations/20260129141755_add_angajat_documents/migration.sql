-- CreateTable
CREATE TABLE "AngajatDocument" (
    "id" TEXT NOT NULL,
    "angajatId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "type" TEXT,
    "size" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploadedBy" TEXT,

    CONSTRAINT "AngajatDocument_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AngajatDocument" ADD CONSTRAINT "AngajatDocument_angajatId_fkey" FOREIGN KEY ("angajatId") REFERENCES "Angajat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
