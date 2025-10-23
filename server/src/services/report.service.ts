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
  const onboardings = await prisma.onboarding.findMany({
    where: {
      ...(department ? { department } : {}),
      ...((startDate || endDate)
        ? {
            createdAt: {
              ...(startDate ? { gte: new Date(startDate) } : {}),
              ...(endDate ? { lte: new Date(endDate) } : {}),
            },
          }
        : {}),
    },
    select: {
      tasks: true,
    },
  });

  const counts: Record<string, number> = {};

  for (const onboarding of onboardings) {
    const tasksValue = onboarding.tasks as unknown;
    const tasksArray = Array.isArray(tasksValue) ? tasksValue : [];

  const allTasksCompleted =
      tasksArray.length > 0 &&
      tasksArray.every((task) => {
        if (typeof task !== "object" || task === null) {
          return false;
        }

        const completedFlag = (task as { completed?: unknown }).completed;
        return completedFlag === true;
      });

    const key = allTasksCompleted ? "completed" : "in_progress";

    counts[key] = (counts[key] ?? 0) + 1;
  }

  const formatted = Object.entries(counts).map(([currentStatus, count]) => ({
    status: currentStatus,
    count,
  }));

  return status ? formatted.filter((entry) => entry.status === status) : formatted;
};
