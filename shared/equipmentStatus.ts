export const EQUIPMENT_STATUS = {
  IN_STOC: 'in_stoc',
  ALOCAT: 'alocat',
  IN_COMANDA: 'in_comanda',
  MENTENANTA: 'mentenanta',
} as const;

export type EquipmentStatus = (typeof EQUIPMENT_STATUS)[keyof typeof EQUIPMENT_STATUS];