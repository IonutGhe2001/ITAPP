export const allowsMultipleAssignments = (tip?: string | null): boolean => {
  if (!tip) {
    return false;
  }

  const normalized = tip.trim().toLowerCase();

  if (!normalized) {
    return false;
  }

  return normalized.includes("consum");
};