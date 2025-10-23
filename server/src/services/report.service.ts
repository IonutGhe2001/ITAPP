import { Prisma } from "@prisma/client";
import { prisma } from "@lib/prisma";

interface ReportQuery {
  department?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}

export const getEquipmentReport = async ({
  department,
  startDate,
  endDate,
  status,
}: ReportQuery) => {
  const where: { stare?: string; createdAt?: { gte?: Date; lte?: Date } } = {};
  if (status) {
    // equipment status is stored in the `stare` field
    where.stare = status;
  }
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) {
      where.createdAt.gte = new Date(startDate);
    }
    if (endDate) {
      where.createdAt.lte = new Date(endDate);
    }
  }
  // department filtering is not directly supported for equipment; ignore for now

  const grouped = await prisma.echipament.groupBy({
    by: ["stare"],
    _count: { _all: true },
    where,
  });

  return grouped.map((g: { stare: string; _count: { _all: number } }) => ({
    type: g.stare,
    count: g._count._all,
  }));
};

export const getOnboardingReport = async ({
  department,
  startDate,
  endDate,
  status,
}: ReportQuery) => {
  const filters: Prisma.Sql[] = [];

  if (department) {
    filters.push(Prisma.sql`"department" = ${department}`);
  }
  if (startDate) {
    filters.push(Prisma.sql`"createdAt" >= ${new Date(startDate)}`);
  }
  if (endDate) {
    filters.push(Prisma.sql`"createdAt" <= ${new Date(endDate)}`);
  }

  const whereClause =
    filters.length > 0
      ? Prisma.sql`WHERE ${Prisma.join(filters, Prisma.sql` AND `)}`
      : Prisma.sql``;

  const rows = (await prisma.$queryRaw(
    Prisma.sql`
    SELECT status, COUNT(*)::int AS count
    FROM (
      SELECT CASE
        WHEN jsonb_typeof(COALESCE("tasks"::jsonb, '[]'::jsonb)) = 'array'
             AND jsonb_array_length(COALESCE("tasks"::jsonb, '[]'::jsonb)) > 0
             AND NOT EXISTS (
               SELECT 1
               FROM jsonb_array_elements(COALESCE("tasks"::jsonb, '[]'::jsonb)) elem
               WHERE COALESCE((elem->>'completed')::boolean, false) = false
             )
          THEN 'completed'
        ELSE 'in_progress'
      END AS status
      FROM "Onboarding"
      ${whereClause}
    ) AS status_counts
    GROUP BY status
  `,
  )) as Array<{ status: string; count: number | bigint }>;

  const formatted = rows.map((row) => ({
    status: row.status,
    count: typeof row.count === "bigint" ? Number(row.count) : row.count,
  }));

  return status ? formatted.filter((r) => r.status === status) : formatted;
};
