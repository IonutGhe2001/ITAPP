import { prisma } from "../lib/prisma";

export type ImportRow = {
  "Nume Echipament": string;
  Tip: string;
  Serie: string;
  "Email Angajat"?: string;
};

export const processImportRows = async (rows: ImportRow[]) => {
  const results: any[] = [];
  const errors: { index: number; error: string }[] = [];

  const limit = parseInt(process.env.IMPORT_CONCURRENCY_LIMIT || "10", 10); // procesează 10 rânduri simultan
  for (let i = 0; i < rows.length; i += limit) {
    const chunk = rows.slice(i, i + limit);

    const chunkResults = await Promise.allSettled(
      chunk.map(async (row, idx) => {
        const index = i + idx;
        try {
          const { "Nume Echipament": nume, Tip: tip, Serie: serie, "Email Angajat": email } = row;

          if (!nume || !tip || !serie) {
            throw new Error("Campuri obligatorii lipsa");
          }

          const existing = await prisma.echipament.findUnique({ where: { serie } });
          if (existing) throw new Error(`Serie duplicata: ${serie}`);

          let angajatId: string | null = null;
          if (email) {
            let angajat = await prisma.angajat.findFirst({ where: { email } });
            if (!angajat) {
              const username = email.split("@")[0];
              const numeComplet = username.replace(".", " ").replace(/\b\w/g, c => c.toUpperCase());

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
              stare: angajatId ? "predat" : "disponibil",
            },
          });

          results.push(echipament);
        } catch (error: any) {
          errors.push({ index, error: error.message || "Eroare necunoscută" });
        }
      })
    );

    // optional: log sau alertă dacă chunk-ul are prea multe erori
  }

  return { results, errors };
};
