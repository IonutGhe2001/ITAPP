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
  const where: { department?: string; createdAt?: { gte?: Date; lte?: Date } } =
    {};
  if (department) {
    where.department = department;
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

  const onboardings = await prisma.onboarding.findMany({ where });
  const counts: Record<string, number> = {};
  for (const ob of onboardings) {
    const tasks = (ob.tasks as { completed: boolean }[]) || [];
    const completed = tasks.length > 0 && tasks.every((t) => t.completed);
    const stat = completed ? "completed" : "in_progress";
    counts[stat] = (counts[stat] || 0) + 1;
  }

  let result = Object.entries(counts).map(([s, c]) => ({
    status: s,
    count: c,
  }));
  if (status) {
    result = result.filter((r) => r.status === status);
  }
  return result;
};
