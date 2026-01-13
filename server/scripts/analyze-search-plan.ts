import { Prisma } from "@prisma/client";
import { prisma } from "../src/lib/prisma";

const term = process.argv[2] ?? "test";
const pattern = `%${term}%`;

type ExplainRow = { "QUERY PLAN": string };

type ExplainResult = ExplainRow[];

const queries: Array<{ label: string; sql: Prisma.Sql }> = [
  {
    label: "Equipment search",
    sql: Prisma.sql`
      EXPLAIN (FORMAT TEXT)
      SELECT "Echipament"."id"
      FROM "Echipament"
      WHERE "Echipament"."nume" ILIKE ${pattern}
         OR "Echipament"."serie" ILIKE ${pattern};
    `,
  },
  {
    label: "Employee search",
    sql: Prisma.sql`
      EXPLAIN (FORMAT TEXT)
      SELECT "Angajat"."id"
      FROM "Angajat"
      WHERE "Angajat"."numeComplet" ILIKE ${pattern}
         OR "Angajat"."functie" ILIKE ${pattern}
         OR "Angajat"."email" ILIKE ${pattern}
         OR "Angajat"."telefon" ILIKE ${pattern}
         OR "Angajat"."cDataUsername" ILIKE ${pattern}
         OR "Angajat"."cDataId" ILIKE ${pattern};
    `,
  },
];

async function main() {
  console.log(`Analyzing query plans for pattern "${pattern}"`);
  for (const { label, sql } of queries) {
    const result = (await prisma.$queryRaw(sql)) as ExplainResult;
    console.log(`\n${label}`);
    for (const row of result) {
      console.log(row["QUERY PLAN"]);
    }
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
