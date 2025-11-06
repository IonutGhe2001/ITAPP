import { prisma } from "../lib/prisma";
import type { Echipament, EquipmentChange } from ".prisma/client";
import { EQUIPMENT_STATUS } from "@shared/equipmentStatus";

type UserMetric = {
  label: string;
  value: string;
};

type UserActivity = {
  title: string;
  time: string;
};

type UserSession = {
  deviceName: string;
  deviceType: string;
  locationName: string;
  lastActive: string;
};

export const getUserMetrics = async (userId: number): Promise<UserMetric[]> => {
  // Get the user's employee record to find assigned equipment
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return [];
  }

  // Find the employee record by matching email
  const angajat = await prisma.angajat.findFirst({
    where: { email: user.email },
    include: {
      echipamente: true,
    },
  });

  const activeAssets =
    angajat?.echipamente.filter((eq: Echipament) => eq.stare === "alocat").length || 0;

  // Count pending onboarding tasks if any
  const pendingOnboarding = angajat
    ? await prisma.onboarding.count({
        where: {
          angajatId: angajat.id,
        },
      })
    : 0;

  // Count purchase requests if needed (placeholder for now)
  const openTickets = 0;

  // Count pending approvals (placeholder for now)
  const pendingApprovals = 0;

  return [
    { label: "Active Assets", value: String(activeAssets) },
    { label: "Open Tickets", value: String(openTickets) },
    { label: "Pending Trainings", value: String(pendingOnboarding) },
    { label: "Approvals", value: String(pendingApprovals) },
  ];
};

export const getUserActivity = async (
  userId: number,
  limit: number
): Promise<UserActivity[]> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return [];
  }

  // Find the employee record by matching email
  const angajat = await prisma.angajat.findFirst({
    where: { email: user.email },
  });

  if (!angajat) {
    return [];
  }

  // Get equipment changes for this employee
  const changes = await prisma.equipmentChange.findMany({
    where: {
      angajatId: angajat.id,
    },
    include: {
      echipament: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });

  const activities: UserActivity[] = changes.map((change: EquipmentChange & { echipament: Echipament }) => {
    let title = "";
    const now = new Date();
    const timeDiff = now.getTime() - change.createdAt.getTime();
    const daysAgo = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));

    let timeStr = "";
    if (daysAgo === 0 && hoursAgo === 0) {
      timeStr = "Just now";
    } else if (daysAgo === 0) {
      timeStr = `${hoursAgo} hour${hoursAgo > 1 ? "s" : ""} ago`;
    } else if (daysAgo === 1) {
      timeStr = "Yesterday";
    } else if (daysAgo < 7) {
      timeStr = `${daysAgo} days ago`;
    } else {
      timeStr = "Last week";
    }

    switch (change.tip) {
      case "ASSIGN":
        title = `New device enrolled: ${change.echipament.nume}`;
        break;
      case "RETURN":
        title = `Returned device: ${change.echipament.nume}`;
        break;
      case "REPLACE":
        title = `Device replaced: ${change.echipament.nume}`;
        break;
    }

    return {
      title,
      time: timeStr,
    };
  });

  // If no activities, add a default one
  if (activities.length === 0) {
    activities.push({
      title: "Account created",
      time: "Recently",
    });
  }

  return activities;
};

export const getUserSessions = async (userId: number): Promise<UserSession[]> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, locatie: true },
  });

  if (!user?.email) {
    return [];
  }

  const angajat = await prisma.angajat.findFirst({
    where: { email: user.email },
    include: {
      departmentConfig: true,
      echipamente: {
        where: { stare: EQUIPMENT_STATUS.ALOCAT },
        include: {
          changes: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      },
    },
  });

  if (!angajat) {
    return [];
  }

  const fallbackLocation = user.locatie || undefined;
  const locationName = angajat.departmentConfig?.name ?? fallbackLocation ?? "Nespecificat";

  return angajat.echipamente.map((echipament) => {
    const eqWithChanges = echipament as Echipament & {
      changes?: (EquipmentChange & { createdAt: Date })[];
    };
    const lastChange = eqWithChanges.changes?.[0]?.createdAt;
    const lastActiveDate = lastChange ?? eqWithChanges.createdAt;

    return {
      deviceName: eqWithChanges.nume,
      deviceType: eqWithChanges.tip,
      locationName,
      lastActive: lastActiveDate.toISOString(),
    } satisfies UserSession;
  });
};