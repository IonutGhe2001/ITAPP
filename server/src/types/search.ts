import { Angajat, Echipament } from "@prisma/client";

export interface EquipmentSuggestion {
  id: string;
  nume: string;
  serie: string;
}

export interface EmployeeSuggestion {
  id: string;
  numeComplet: string;
  functie: string;
  email: string | null;
  cDataUsername: string | null;
  cDataId: string | null;
}

export interface SuggestionsResult {
  echipamente: EquipmentSuggestion[];
  angajati: EmployeeSuggestion[];
}

export type EquipmentSearchResult = Echipament & {
  angajat: Angajat | null;
};

export interface EmployeeSearchResult {
  id: string;
  numeComplet: string;
  functie: string | null;
  email: string | null;
  telefon: string | null;
  cDataUsername: string | null;
  cDataId: string | null;
  cDataNotes: string | null;
  cDataCreated: Date | null;
}

export interface GlobalSearchResult {
  echipamente: EquipmentSearchResult[];
  angajati: EmployeeSearchResult[];
  suggestions?: SuggestionsResult;
}