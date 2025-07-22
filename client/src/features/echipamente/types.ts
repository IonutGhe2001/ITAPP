export interface Echipament {
  id: string;
  tip: string;
  marca: string;
  model: string;
  status: string;
  serie: string;
  user?: string;
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