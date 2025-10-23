import { prisma } from "../lib/prisma";
import { env } from "../config";
import { logger } from "@lib/logger";

export type ImportRow = {
  "Nume Echipament": string;
  Tip: string;
  Serie: string;
  "Email Angajat"?: string;
};

const makeEquipmentKey = (tip: string, serie: string) =>
  JSON.stringify([tip, serie]);

const toEmailKey = (email: string) => email.trim().toLowerCase();

type EquipmentRowData = {
  nume: string;
  tip: string;
  serie: string;
  angajatEmail?: string;
};

type ChunkEntry = {
  index: number;
  key: string;
  data: EquipmentRowData;
};

export const processImportRows = async (rows: ImportRow[]) => {
  const results: unknown[] = [];
  const errors: { index: number; error: string }[] = [];

  const metrics = {
    totalErrors: 0,
    missingFields: 0,
    duplicateEquipment: 0,
    duplicateAssignments: 0,
    existingEquipment: 0,
    employeeCreationFailures: 0,
    createdEmployees: 0,
    createdEquipment: 0,
  };

  if (!rows.length) {
    logger.info("Import batch received with no rows");
    return { results, errors };
  }

  const limit = env.IMPORT_CONCURRENCY_LIMIT;

  const equipmentKeysForPrefetch = new Set<string>();
  const emailsForPrefetch = new Set<string>();

  for (const row of rows) {
    const tip = row.Tip.trim();
    const serie = row.Serie.trim();
    if (tip && serie) {
      equipmentKeysForPrefetch.add(makeEquipmentKey(tip, serie));
    }

    const email = row["Email Angajat"]?.trim();
    if (email) {
      emailsForPrefetch.add(email);
    }
  }

  const existingEquipmentKeys = new Set<string>();
  if (equipmentKeysForPrefetch.size) {
    const existingEquipment = await prisma.echipament.findMany({
      where: {
        OR: Array.from(equipmentKeysForPrefetch).map((key) => {
          const [tip, serie] = JSON.parse(key) as [string, string];
          return { tip, serie };
        }),
      },
      select: { tip: true, serie: true },
    });

    for (const item of existingEquipment) {
      existingEquipmentKeys.add(makeEquipmentKey(item.tip, item.serie));
    }
  }

  const employeeIdMap = new Map<string, string>();
  const employeeTypeAssignments = new Map<string, Set<string>>();

  if (emailsForPrefetch.size) {
    const existingEmployees = await prisma.angajat.findMany({
      where: {
        email: {
          in: Array.from(emailsForPrefetch),
        },
      },
      include: {
        echipamente: {
          select: {
            tip: true,
          },
        },
      },
    });

    for (const employee of existingEmployees) {
      if (!employee.email) continue;
      const emailKey = toEmailKey(employee.email);
      employeeIdMap.set(emailKey, employee.id);
      const equipmentTypes = new Set<string>();
      for (const equipment of employee.echipamente) {
        equipmentTypes.add(equipment.tip);
      }
      employeeTypeAssignments.set(emailKey, equipmentTypes);
    }
  }

  const scheduledEquipmentKeys = new Set<string>();

  for (let i = 0; i < rows.length; i += limit) {
    const chunk = rows.slice(i, i + limit);
    const chunkEntries: ChunkEntry[] = [];
    const chunkNewEmployees = new Map<
      string,
      { email: string; numeComplet: string; functie: string }
    >();

    for (let idx = 0; idx < chunk.length; idx++) {
      const row = chunk[idx];
      const index = i + idx;

          const nume = row["Nume Echipament"].trim();
      const tip = row.Tip.trim();
      const serie = row.Serie.trim();
      const rawEmail = row["Email Angajat"]?.trim();

      if (!nume || !tip || !serie) {
        metrics.missingFields += 1;
        metrics.totalErrors += 1;
        errors.push({ index, error: "Campuri obligatorii lipsa" });
        continue;
      }

      const key = makeEquipmentKey(tip, serie);

      if (existingEquipmentKeys.has(key)) {
        metrics.existingEquipment += 1;
        metrics.totalErrors += 1;
        errors.push({
          index,
          error: `Serie duplicata pentru tipul ${tip}: ${serie}`,
        });
        continue;
      }

      if (scheduledEquipmentKeys.has(key)) {
        metrics.duplicateEquipment += 1;
        metrics.totalErrors += 1;
        errors.push({
          index,
          error: `Serie duplicata in import pentru tipul ${tip}: ${serie}`,
        });
        continue;
      }

      let emailKey: string | undefined;
      if (rawEmail) {
        emailKey = toEmailKey(rawEmail);
        const assignedTypes =
          employeeTypeAssignments.get(emailKey) ?? new Set<string>();
        if (assignedTypes.has(tip)) {
          metrics.duplicateAssignments += 1;
          metrics.totalErrors += 1;
          errors.push({
            index,
            error: `Angajatul are deja echipament de tip ${tip}`,
          });
          continue;
        }

          if (!employeeTypeAssignments.has(emailKey)) {
          employeeTypeAssignments.set(emailKey, assignedTypes);
        }

          if (!employeeIdMap.has(emailKey) && !chunkNewEmployees.has(emailKey)) {
          const username = rawEmail.split("@")[0] ?? rawEmail;
          const numeComplet = username
            .replace(".", " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());

          chunkNewEmployees.set(emailKey, {
            email: rawEmail,
            numeComplet: numeComplet || rawEmail,
            functie: "Import automat",
          });
        }
      }

      chunkEntries.push({
        index,
        key,
        data: {
          nume,
          tip,
          serie,
          angajatEmail: rawEmail || undefined,
        },
      });

      scheduledEquipmentKeys.add(key);

      if (emailKey) {
        const types = employeeTypeAssignments.get(emailKey) ?? new Set<string>();
        types.add(tip);
        employeeTypeAssignments.set(emailKey, types);
      }
    }

    if (!chunkEntries.length) continue;

    if (chunkNewEmployees.size) {
      const employeePayload = Array.from(chunkNewEmployees.values());
      try {
        const createResult = await prisma.angajat.createMany({
          data: employeePayload,
          skipDuplicates: true,
        });
        metrics.createdEmployees += createResult.count;
      } catch (error: unknown) {
        logger.error("Failed to create employees during import", {
          error: error instanceof Error ? error.message : error,
        });
      }

      const createdEmployees = await prisma.angajat.findMany({
        where: {
          email: {
            in: employeePayload.map((item) => item.email),
          },
        },
        select: {
          id: true,
          email: true,
        },
      });

      for (const employee of createdEmployees) {
        if (!employee.email) continue;
        const emailKey = toEmailKey(employee.email);
        employeeIdMap.set(emailKey, employee.id);
        if (!employeeTypeAssignments.has(emailKey)) {
          employeeTypeAssignments.set(emailKey, new Set());
        }
      }
    }

          const readyEntries: ChunkEntry[] = [];
    for (const entry of chunkEntries) {
      const { angajatEmail, tip } = entry.data;
      if (angajatEmail) {
        const emailKey = toEmailKey(angajatEmail);
        if (!employeeIdMap.has(emailKey)) {
          metrics.employeeCreationFailures += 1;
          metrics.totalErrors += 1;
          errors.push({
            index: entry.index,
            error: `Nu am putut crea angajatul pentru emailul ${angajatEmail}`,
          });
          scheduledEquipmentKeys.delete(entry.key);
          const types = employeeTypeAssignments.get(emailKey);
          if (types) {
            types.delete(tip);
            if (!types.size) {
              employeeTypeAssignments.delete(emailKey);
            }
          }
          continue;
        }
      }

      readyEntries.push(entry);
    }

    if (!readyEntries.length) continue;

    const equipmentData = readyEntries.map((entry) => {
      const { nume, tip, serie, angajatEmail } = entry.data;
      let angajatId: string | undefined;
      if (angajatEmail) {
        const emailKey = toEmailKey(angajatEmail);
        angajatId = employeeIdMap.get(emailKey) ?? undefined;
      }

      return {
        nume,
        tip,
        serie,
        stare: angajatId ? "alocat" : "in_stoc",
        ...(angajatId ? { angajatId } : {}),
      };
    });

    try {
      const createResult = await prisma.echipament.createMany({
        data: equipmentData,
      });
      metrics.createdEquipment += createResult.count;
      for (const entry of readyEntries) {
        existingEquipmentKeys.add(entry.key);
        results.push({
          index: entry.index,
          nume: entry.data.nume,
          tip: entry.data.tip,
          serie: entry.data.serie,
          angajatEmail: entry.data.angajatEmail,
        });
      }
    } catch (error: unknown) {
      logger.error("Failed to create equipment batch during import", {
        error: error instanceof Error ? error.message : error,
      });

      for (const entry of readyEntries) {
        metrics.totalErrors += 1;
        errors.push({
          index: entry.index,
          error: `Eroare la salvarea echipamentului ${entry.data.tip} - ${entry.data.serie}`,
        });
        scheduledEquipmentKeys.delete(entry.key);
        const { angajatEmail, tip } = entry.data;
        if (angajatEmail) {
          const emailKey = toEmailKey(angajatEmail);
          const types = employeeTypeAssignments.get(emailKey);
          if (types) {
            types.delete(tip);
            if (!types.size) {
              employeeTypeAssignments.delete(emailKey);
            }
          }
        }
      }
    }
  }

  if (metrics.totalErrors) {
    logger.warn("Import batch completed with errors", {
      totalRows: rows.length,
      errors: metrics.totalErrors,
      missingFields: metrics.missingFields,
      duplicateEquipment: metrics.duplicateEquipment,
      duplicateAssignments: metrics.duplicateAssignments,
      existingEquipment: metrics.existingEquipment,
      employeeCreationFailures: metrics.employeeCreationFailures,
    });
  }

  logger.info("Import batch processed", {
    totalRows: rows.length,
    createdEquipment: metrics.createdEquipment,
    createdEmployees: metrics.createdEmployees,
    errors: metrics.totalErrors,
  });

  return { results, errors };
};
