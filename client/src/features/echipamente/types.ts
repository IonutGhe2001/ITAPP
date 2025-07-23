export interface Angajat {
  id: string;
  numeComplet: string;
  functie: string;
  email?: string;
  telefon?: string;
}

export interface Echipament {
  id: string;
  nume: string;
  tip: string;
  serie: string;
  stare: string;
  angajatId?: string | null;
  /**
   * Included when the backend query joins the related angajat.
   */
  angajat?: {
    numeComplet: string;
    id: string;
  };
  [key: string]: any;
}

export interface EquipmentCardProps {
  echipament: Echipament;
  onEdit?: (echipament: Echipament) => void;
  onDelete?: (id: string) => void;
  onRefresh?: () => void;
}

export interface EquipmentFilterProps {
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export interface EquipmentListProps {
  echipamente: Echipament[];
  onEdit?: (echipament: Echipament) => void;
  onDelete?: (id: string) => void;
}

export interface EquipmentTabsProps {
  active: string;
  onChange: (value: string) => void;
}

export interface ModalEditEchipamentProps {
  echipament: Echipament;
  onClose: () => void;
  onUpdated: (updated: Echipament) => void;
}

export interface ModalPredaEchipamentProps {
  echipament: Echipament;
  onClose: () => void;
  onSubmit: (data: any) => void;
}