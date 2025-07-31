-- CreateEnum
CREATE TYPE "ProcesVerbalTip" AS ENUM ('PREDARE_PRIMIRE', 'RESTITUIRE', 'SCHIMB');

-- AlterTable
ALTER TABLE "ProcesVerbal" ADD COLUMN     "tip" "ProcesVerbalTip" NOT NULL DEFAULT 'PREDARE_PRIMIRE';
