import { prisma } from "../lib/prisma";
import { EQUIPMENT_STATUS } from "@shared/equipmentStatus";
import type { Echipament, EquipmentChange, Angajat } from ".prisma/client";

type OverviewStats = {
  total: number;
  in_stock: number;
  allocated: number;
  repair_retired: number;
  deltas: {
    total: number;
    in_stock: number;
    allocated: number;
    repair_retired: number;
  };
};

type EquipmentStatusRecord = {
  status: string;
  in_stock: number;
  allocated: number;
  repair: number;
  retired: number;
};

type AlertSeverity = "info" | "warning" | "critical";

type Alert = {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  timestamp: string;
};

const STATUS_CATEGORY_MAP: Record<
  string,
  keyof Omit<EquipmentStatusRecord, "status">
> = {
  [EQUIPMENT_STATUS.IN_STOC]: "in_stock",
  [EQUIPMENT_STATUS.ALOCAT]: "allocated",
  [EQUIPMENT_STATUS.MENTENANTA]: "repair",
  [EQUIPMENT_STATUS.IN_COMANDA]: "retired",
  in_reparatie: "repair",
  retras: "retired",
};

type PvQueueItem = {
  id: string;
  employeeId: string;
  employee: string;
  equipment: string;
  allocationDate: string;
  location: string;
  status: "pending" | "overdue";
};

type ActivityItem = {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
};

export const getOverviewStats = async (): Promise<OverviewStats> => {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Get current counts
  const [currentTotal, currentGrouped] = await Promise.all([
    prisma.echipament.count(),
    prisma.echipament.groupBy({
      by: ["stare"],
      _count: { stare: true },
    }),
  ]);

  // Get counts from 7 days ago
  const [previousTotal, previousGrouped] = await Promise.all([
    prisma.echipament.count({
      where: {
        createdAt: { lte: sevenDaysAgo },
      },
    }),
    prisma.echipament.groupBy({
      by: ["stare"],
      _count: { stare: true },
      where: {
        createdAt: { lte: sevenDaysAgo },
      },
    }),
  ]);

  const currentCounts: Record<string, number> = {
    in_stock: 0,
    allocated: 0,
    repair: 0,
    retired: 0,
  };

  const previousCounts: Record<string, number> = {
    in_stock: 0,
    allocated: 0,
    repair: 0,
    retired: 0,
  };

  currentGrouped.forEach(
    ({ stare, _count }: { stare: string; _count: { stare: number } }) => {
      const category = STATUS_CATEGORY_MAP[stare];
      if (category) {
        currentCounts[category] = _count.stare;
      }
    }
  );

  previousGrouped.forEach(
    ({ stare, _count }: { stare: string; _count: { stare: number } }) => {
      const category = STATUS_CATEGORY_MAP[stare];
      if (category) {
        previousCounts[category] = _count.stare;
      }
    }
  );

  const repair_retired = currentCounts.repair + currentCounts.retired;
  const previous_repair_retired =
    previousCounts.repair + previousCounts.retired;

  return {
    total: currentTotal,
    in_stock: currentCounts.in_stock,
    allocated: currentCounts.allocated,
    repair_retired,
    deltas: {
      total: ((currentTotal - previousTotal) / (previousTotal || 1)) * 100,
      in_stock:
        ((currentCounts.in_stock - previousCounts.in_stock) /
          (previousCounts.in_stock || 1)) *
        100,
      allocated:
        ((currentCounts.allocated - previousCounts.allocated) /
          (previousCounts.allocated || 1)) *
        100,
      repair_retired:
        ((repair_retired - previous_repair_retired) /
          (previous_repair_retired || 1)) *
        100,
    },
  };
};

export const getEquipmentStatusTimeline = async (): Promise<
  EquipmentStatusRecord[]
> => {
  // Get equipment grouped by type and status
  const equipmentByType = await prisma.echipament.groupBy({
    by: ["tip", "stare"],
    _count: { tip: true },
  });

  // Organize data by equipment type
  type StatusCounts = {
    in_stock: number;
    allocated: number;
    repair: number;
    retired: number;
  };
  const typeMap = new Map<string, StatusCounts>();

  equipmentByType.forEach((item: { tip: string; stare: string; _count: { tip: number } }) => {
    if (!typeMap.has(item.tip)) {
      typeMap.set(item.tip, {
        in_stock: 0,
        allocated: 0,
        repair: 0,
        retired: 0,
      });
    }

    const counts = typeMap.get(item.tip)!;
    const category = STATUS_CATEGORY_MAP[item.stare];
    if (category) {
      counts[category] = item._count.tip;
    }
  });

  // Convert to array format
  return Array.from(typeMap.entries()).map(([tip, counts]): EquipmentStatusRecord => ({
    status: tip,
    ...counts,
  }));
};

export const getAlerts = async (limit: number): Promise<Alert[]> => {
  const now = new Date();
  const alerts: Alert[] = [];

  // Check for warranties expiring soon (within 7 days)
  const expiringWarranties = await prisma.echipament.findMany({
    where: {
      garantie: {
        gte: now,
        lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      },
    },
    take: limit,
    orderBy: { garantie: "asc" },
  });

  expiringWarranties.forEach((eq: Echipament) => {
    const daysLeft = Math.ceil(
      (new Date(eq.garantie!).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    alerts.push({
      id: `warranty-${eq.id}`,
      title: `Garanție expirată în ${daysLeft} zile`,
      description: `${eq.nume} #${eq.serie} își încheie garanția în mai puțin de o săptămână.`,
      severity: daysLeft <= 3 ? "critical" : "warning",
      timestamp: new Date().toISOString(),
    });
  });

  // Check for equipment unallocated for more than 10 days
  const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
  const unallocatedEquipment = await prisma.echipament.findMany({
    where: {
      stare: "in_stoc",
      createdAt: { lte: tenDaysAgo },
    },
    take: Math.max(0, limit - alerts.length),
    orderBy: { createdAt: "asc" },
  });

  unallocatedEquipment.forEach((eq: Echipament) => {
    const daysUnallocated = Math.floor(
      (now.getTime() - new Date(eq.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    alerts.push({
      id: `unallocated-${eq.id}`,
      title: `Echipament nealocat de ${daysUnallocated} zile`,
      description: `${eq.nume} #${eq.serie} este în depozit fără titular din ${daysUnallocated} zile.`,
      severity: "info",
      timestamp: new Date().toISOString(),
    });
  });

  // Check for missing PVs (equipment changes without PV)
  const missingPvs = await prisma.equipmentChange.findMany({
    where: {
      includedInPV: false,
      tip: "ASSIGN",
    },
    include: {
      echipament: true,
    },
    take: Math.max(0, limit - alerts.length),
    orderBy: { createdAt: "asc" },
  });

  missingPvs.forEach((change: EquipmentChange & { echipament: Echipament }) => {
    alerts.push({
      id: `missing-pv-${change.id}`,
      title: "PV lipsă după alocare",
      description: `${change.echipament.nume} #${change.echipament.serie} nu are PV generat după predare.`,
      severity: "critical",
      timestamp: change.createdAt.toISOString(),
    });
  });

  return alerts.slice(0, limit);
};

export const getPvQueue = async (limit: number): Promise<PvQueueItem[]> => {
  const now = new Date();

  // Get equipment changes not included in PV yet
  const changes = await prisma.equipmentChange.findMany({
    where: {
      includedInPV: false,
      tip: "ASSIGN",
    },
    include: {
      angajat: { include: { departmentConfig: true } },
      echipament: true,
    },
    take: limit,
    orderBy: { createdAt: "asc" },
  });

  return changes.map((change: EquipmentChange & { angajat: Angajat; echipament: Echipament }) => {
    const daysSinceAllocation = Math.floor(
      (now.getTime() - new Date(change.createdAt).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const isOverdue = daysSinceAllocation > 7;

    return {
      id: change.id,
      employeeId: change.angajatId,
      employee: change.angajat.numeComplet,
      equipment: `${change.echipament.nume} ${change.echipament.serie}`,
      allocationDate: change.createdAt.toISOString(),
      location: change.angajat.departmentConfig?.name ?? "București - Sediu Central",
      status: isOverdue ? ("overdue" as const) : ("pending" as const),
    };
  });
};

export const getActivity = async (limit: number): Promise<ActivityItem[]> => {
  // Get recent equipment changes
  const changes = await prisma.equipmentChange.findMany({
    include: {
      angajat: true,
      echipament: true,
    },
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  return changes.map((change: EquipmentChange & { angajat: Angajat; echipament: Echipament }) => {
    let action = "";
    let target = "";

    switch (change.tip) {
      case "ASSIGN":
        action = "a alocat";
        target = `${change.echipament.nume} către ${change.angajat.numeComplet}`;
        break;
      case "RETURN":
        action = "a returnat";
        target = `${change.echipament.nume} de la ${change.angajat.numeComplet}`;
        break;
      case "REPLACE":
        action = "a înlocuit";
        target = `${change.echipament.nume} pentru ${change.angajat.numeComplet}`;
        break;
    }

    return {
      id: change.id,
      actor: change.angajat.numeComplet,
      action,
      target,
      timestamp: change.createdAt.toISOString(),
    };
  });
};