import { EQUIPMENT_STATUS, type EquipmentStatus } from '@shared/equipmentStatus';
import type { ReactNode } from 'react';
export { EQUIPMENT_STATUS } from '@shared/equipmentStatus';
export type { EquipmentStatus } from '@shared/equipmentStatus';

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
  departmentConfigId?: string | null;
  dataAngajare?: string;
  checklist?: string[];
  licenses?: string[];
  echipamente?: Echipament[];
  emailAccountStatus?: 'PENDING' | 'CREATED';
  emailAccountCreatedAt?: string;
  emailAccountResponsible?: string;
  emailAccountLink?: string;
}

export const EQUIPMENT_STATUS_LABELS: Record<EquipmentStatus, string> = {
  [EQUIPMENT_STATUS.IN_STOC]: 'În stoc',
  [EQUIPMENT_STATUS.ALOCAT]: 'Alocate',
  [EQUIPMENT_STATUS.IN_COMANDA]: 'În comandă',
  [EQUIPMENT_STATUS.MENTENANTA]: 'În mentenanță',
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
  cpu?: string;
  ram?: string;
  stocare?: string;
  os?: string;
  versiuneFirmware?: string;
  numarInventar?: string;
  dataAchizitie?: string;
  garantie?: string;
  defectAt?: string;
  metadata?: Record<string, unknown>;
  documents?: EquipmentDocument[];
  images?: EquipmentImage[];
  meta?: {
    warrantyDaysLeft?: number;
    warrantyExpired?: boolean;
    ageYears?: number;
    defectDays?: number;
  };
}

export interface EchipamentInput {
  nume: string;
  tip: string;
  serie: string;
  angajatId: string | null;
  stare?: EquipmentStatus;
  cpu?: string;
  ram?: string;
  stocare?: string;
  os?: string;
  versiuneFirmware?: string;
  numarInventar?: string;
  dataAchizitie?: string;
  garantie?: string;
  metadata?: unknown;
}

export interface EchipamentUpdateInput {
  nume?: string;
  tip?: string;
  serie?: string;
  angajatId?: string | null;
  stare?: EquipmentStatus;
  cpu?: string;
  ram?: string;
  stocare?: string;
  os?: string;
  versiuneFirmware?: string;
  numarInventar?: string;
  dataAchizitie?: string;
  garantie?: string;
  metadata?: unknown;
}

export interface EquipmentDocument {
  id: string;
  name: string;
  path: string;
  createdAt: string;
}

export interface EquipmentImage {
  id: string;
  url: string;
  createdAt: string;
}

export type EquipmentSortOption = 'name-asc' | 'name-desc' | 'assigned-date' | 'status';

export interface EquipmentCardProps {
  echipament: Echipament;
  onEdit?: (echipament: Echipament & { __editMode?: boolean }) => void;
  onDelete?: (id: string) => void;
  onTransfer?: (echipament: Echipament) => void;
  onViewDetails?: (echipament: Echipament) => void;
  onRefresh?: () => void;
}

export interface EquipmentFilterProps {
  search: string;
  status: string;
  type: string;
  sort: EquipmentSortOption;
  types: string[];
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onSortChange: (value: EquipmentSortOption) => void;
}

export interface EquipmentListProps {
  echipamente: Echipament[];
  onEdit?: (echipament: Echipament & { __editMode?: boolean }) => void;
  onDelete?: (id: string) => void;
  onTransfer?: (echipament: Echipament) => void;
  onViewDetails?: (echipament: Echipament) => void;
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

export interface StatusBadgeProps {
  status: EquipmentStatus;
}

export interface EquipmentActionsProps {
  echipament: Echipament;
  onEdit?: (echipament: Echipament & { __editMode?: boolean }) => void;
  onDelete?: (id: string) => void;
  onAllocate: () => void;
  onRecupereaza: () => void;
}

export interface EquipmentCardModalsProps {
  echipament: Echipament;
  onEdit?: (echipament: Echipament & { __editMode?: boolean }) => void;
  onRefresh?: () => void;
}

export interface EquipmentCardModalsResult {
  openAllocation: () => void;
  openRecupereaza: () => void;
  allocationModal: ReactNode;
  recupereazaModal: ReactNode;
}