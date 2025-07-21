import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const processImportRows = async (rows: any[]) => {
  const results: any[] = [];
  const errors: { index: number; error: string }[] = [];

  for (const [index, row] of rows.entries()) {
    const {
      "Nume Echipament": nume,
      Tip: tip,
      Serie: serie,
      "Email Angajat": email,
    } = row as Record<string, string>;

    if (!nume || !tip || !serie) {
      errors.push({ index, error: "Campuri obligatorii lipsa" });
      continue;
    }

    const existing = await prisma.echipament.findUnique({ where: { serie } });
    if (existing) {
      errors.push({ index, error: `Serie duplicata: ${serie}` });
      continue;
    }

    let angajatId: string | null = null;
    if (email) {
      let angajat = await prisma.angajat.findFirst({ where: { email } });

      if (!angajat) {
        const username = email.split("@")[0];
        const numeComplet = username
          .replace(".", " ")
          .replace(/(^\w{1})|(\s+\w{1})/g, (l) => l.toUpperCase());

        angajat = await prisma.angajat.create({
          data: {
            email,
            numeComplet,
            functie: "Necunoscuta",
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
        stare: angajatId ? "asignat" : "disponibil",
        angajatId,
      },
    });

    results.push(echipament);
  }

  return { results, errors };
};
