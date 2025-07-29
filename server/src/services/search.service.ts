import { prisma } from "../lib/prisma";
import { levenshtein } from "../utils/levenshtein";

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
}

interface SuggestionsResult {
  echipamente: EquipmentSuggestion[];
  angajati: EmployeeSuggestion[];
}

interface GlobalSearchResult {
  echipamente: any[];
  angajati: any[];
  suggestions?: SuggestionsResult;
}

export const globalSearch = async (
  query: string
): Promise<GlobalSearchResult> => {
  const q = query.trim();
 if (!q) {
    return { echipamente: [], angajati: [], suggestions: { echipamente: [], angajati: [] } };
  }

  const echipamente = await prisma.echipament.findMany({
    where: {
      OR: [
        { nume: { contains: q, mode: "insensitive" } },
        { serie: { contains: q, mode: "insensitive" } },
      ],
    },
    include: { angajat: true },
  });

  const angajati = await prisma.angajat.findMany({
    where: {
      OR: [
        { numeComplet: { contains: q, mode: "insensitive" } },
        { functie: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { telefon: { contains: q, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      numeComplet: true,
      functie: true,
      email: true,
      telefon: true,
    },
  });

   if (!echipamente.length && !angajati.length) {
    const suggestions = await computeSuggestions(q);
    return { echipamente, angajati, suggestions };
  }

  return { echipamente, angajati };
};

export const getSuggestions = async (
  query: string
): Promise<SuggestionsResult> => {
  const q = query.trim();
  if (!q) {
    return { echipamente: [], angajati: [] };
  }

  return computeSuggestions(q);
};
const MAX_SUGGESTION_ITEMS = 5;
const SEARCH_SAMPLE_SIZE = 50;

const computeSuggestions = async (
  query: string
): Promise<SuggestionsResult> => {
  const q = query.toLowerCase();
  const equipments = (await prisma.echipament.findMany({
    take: SEARCH_SAMPLE_SIZE,
    select: { id: true, nume: true, serie: true },
  })) as EquipmentSuggestion[];
  const equipmentSuggestions = equipments
    .map((e): { item: EquipmentSuggestion; score: number } => ({
      item: e,
      score: Math.min(
        levenshtein(e.nume.toLowerCase(), q),
        levenshtein(e.serie.toLowerCase(), q)
      ),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, MAX_SUGGESTION_ITEMS)
    .map((e) => e.item);

  const employees = (await prisma.angajat.findMany({
    take: SEARCH_SAMPLE_SIZE,
    select: { id: true, numeComplet: true, functie: true, email: true },
  })) as EmployeeSuggestion[];
  const employeeSuggestions = employees
    .map((a): { item: EmployeeSuggestion; score: number } => ({
      item: a,
      score: Math.min(
        levenshtein(a.numeComplet.toLowerCase(), q),
        levenshtein((a.functie || '').toLowerCase(), q),
        levenshtein((a.email || '').toLowerCase(), q)
      ),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, MAX_SUGGESTION_ITEMS)
    .map((a) => a.item);

  return { echipamente: equipmentSuggestions, angajati: employeeSuggestions };
};