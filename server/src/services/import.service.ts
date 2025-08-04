import { prisma } from "../lib/prisma";
import { env } from "../config";
import type { Prisma, PrismaClient } from "@prisma/client";

export type ImportRow = {
  "Nume Echipament": string;
  Tip: string;
  Serie: string;
  "Email Angajat"?: string;
};

export const processImportRows = async (rows: ImportRow[]) => {
  const results: Prisma.Echipament[] = [];
  const errors: { index: number; error: string }[] = [];

  const limit = env.IMPORT_CONCURRENCY_LIMIT; // procesează 10 rânduri simultan
  for (let i = 0; i < rows.length; i += limit) {
    const chunk = rows.slice(i, i + limit);

    const chunkResults = await Promise.allSettled(
      chunk.map(async (row, idx) => {
        const index = i + idx;
        try {
          const {
            "Nume Echipament": nume,
            Tip: tip,
            Serie: serie,
            "Email Angajat": email,
          } = row;

          if (!nume || !tip || !serie) {
            throw new Error("Campuri obligatorii lipsa");
          }

          const existing = await prisma.echipament.findFirst({
            where: { tip, serie },
          });
          if (existing)
            throw new Error(`Serie duplicata pentru tipul ${tip}: ${serie}`);

          if (email) {
            const hasSameType = await prisma.echipament.findFirst({
              where: { angajat: { email }, tip },
            });
            if (hasSameType) {
              throw new Error(`Angajatul are deja echipament de tip ${tip}`);
            }
          }

          let angajatId: string | null = null;
          if (email) {
            let angajat = await prisma.angajat.findFirst({ where: { email } });
            if (!angajat) {
              const username = email.split("@")[0];
              const numeComplet = username
                .replace(".", " ")
                .replace(/\b\w/g, (c) => c.toUpperCase());

              angajat = await prisma.angajat.create({
                data: {
                  email,
                  numeComplet,
                  functie: "Import automat",
                },
              });
            }
            angajatId = angajat.id;
          }

          const echipament = await prisma.echipament.create({
            data: {
              nume,
              tip,
              serie,
              angajatId,
              stare: angajatId ? "alocat" : "in_stoc",
            },
          });

          results.push(echipament);
        } catch (error: unknown) {
          errors.push({
            index,
            error:
              error instanceof Error ? error.message : "Eroare necunoscută",
          });
        }
      })
    );

    // optional: log sau alertă dacă chunk-ul are prea multe erori
  }

  return { results, errors };
};
