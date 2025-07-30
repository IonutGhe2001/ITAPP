-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nume" TEXT NOT NULL,
    "prenume" TEXT NOT NULL,
    "functie" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "telefon" TEXT,
    "profilePicture" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Angajat" (
    "id" TEXT NOT NULL,
    "numeComplet" TEXT NOT NULL,
    "functie" TEXT NOT NULL,
    "email" TEXT,
    "telefon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Angajat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Echipament" (
    "id" TEXT NOT NULL,
    "nume" TEXT NOT NULL,
    "tip" TEXT NOT NULL,
    "serie" TEXT NOT NULL,
    "stare" TEXT NOT NULL,
    "angajatId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Echipament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Eveniment" (
    "id" SERIAL NOT NULL,
    "titlu" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "ora" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Eveniment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcesVerbal" (
    "id" TEXT NOT NULL,
    "angajatId" TEXT NOT NULL,
    "dataGenerare" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observatii" TEXT,

    CONSTRAINT "ProcesVerbal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EchipamenteProcesVerbal" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EchipamenteProcesVerbal_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "_EchipamenteProcesVerbal_B_index" ON "_EchipamenteProcesVerbal"("B");

-- AddForeignKey
ALTER TABLE "Echipament" ADD CONSTRAINT "Echipament_angajatId_fkey" FOREIGN KEY ("angajatId") REFERENCES "Angajat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcesVerbal" ADD CONSTRAINT "ProcesVerbal_angajatId_fkey" FOREIGN KEY ("angajatId") REFERENCES "Angajat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EchipamenteProcesVerbal" ADD CONSTRAINT "_EchipamenteProcesVerbal_A_fkey" FOREIGN KEY ("A") REFERENCES "Echipament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EchipamenteProcesVerbal" ADD CONSTRAINT "_EchipamenteProcesVerbal_B_fkey" FOREIGN KEY ("B") REFERENCES "ProcesVerbal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
