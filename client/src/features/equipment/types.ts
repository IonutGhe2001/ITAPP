export interface Angajat {
  id: string;
  numeComplet: string;
  functie: string;
  email?: string;
  telefon?: string;
  cDataUsername?: string;
  cDataId?: string;
  cDataNotes?: string;
  cDataCreated: boolean;
  emailAccountStatus?: "PENDING" | "CREATED";
  emailAccountCreatedAt?: string;
  emailAccountResponsible?: string;
  emailAccountLink?: string;
}

export const EQUIPMENT_STATUS = {
  IN_STOC: "in_stoc",
  ALOCAT: "alocat",
  IN_COMANDA: "in_comanda",
  MENTENANTA: "mentenanta",
} as const;

export type EquipmentStatus =
  (typeof EQUIPMENT_STATUS)[keyof typeof EQUIPMENT_STATUS];

export const EQUIPMENT_STATUS_LABELS: Record<EquipmentStatus, string> = {
  [EQUIPMENT_STATUS.IN_STOC]: "În stoc",
  [EQUIPMENT_STATUS.ALOCAT]: "Alocate",
  [EQUIPMENT_STATUS.IN_COMANDA]: "În comandă",
  [EQUIPMENT_STATUS.MENTENANTA]: "În mentenanță",
};

export interface Echipament {
  id: string;
  nume: string;
  tip: string;
  serie: string;
  stare: EquipmentStatus;
  angajatId?: string | null;
  /**
   * Included when the backend query joins the related angajat.
   */
  angajat?: {
    numeComplet: string;
    id: string;
  };
  metadata?: Record<string, unknown>;
}

export interface EchipamentInput {
  nume: string;
  tip: string;
  serie: string;
  angajatId: string | null;
  stare?: EquipmentStatus;
  metadata?: unknown;
}

export interface EchipamentUpdateInput {
  nume?: string;
  tip?: string;
  serie?: string;
  angajatId?: string | null;
  stare?: EquipmentStatus;
  metadata?: unknown;
}

export interface EquipmentCardProps {
  echipament: Echipament;
  onEdit?: (echipament: Echipament & { __editMode?: boolean }) => void;
  onDelete?: (id: string) => void;
  onRefresh?: () => void;
}

export interface EquipmentFilterProps {
  search: string;
  status: string;
  sort: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

export interface EquipmentListProps {
  echipamente: Echipament[];
  onEdit?: (echipament: Echipament & { __editMode?: boolean }) => void;
  onDelete?: (id: string) => void;
}

export interface EquipmentTabsProps {
  active: string;
  onChange: (value: string) => void;
  tabs: string[];
}

export interface ModalEditEchipamentProps {
  echipament: Echipament;
  onClose: () => void;
  onUpdated: (updated: Echipament) => void;
}

export interface ModalPredaEchipamentProps {
  echipament: Echipament;
  onClose: () => void;
  onSubmit: (data: Echipament) => void;
}