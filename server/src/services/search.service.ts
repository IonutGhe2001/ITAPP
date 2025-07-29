import { prisma } from "../lib/prisma";
import { levenshtein } from "../utils/levenshtein";

export const globalSearch = async (query: string) => {
  const q = query.trim();
 if (!q) return { echipamente: [], angajati: [], suggestions: [] };

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

export const getSuggestions = async (query: string) => {
  const q = query.trim();
  if (!q) {
    return { echipamente: [], angajati: [] };
  }

  return computeSuggestions(q);
};
const MAX_SUGGESTION_ITEMS = 5;
const SEARCH_SAMPLE_SIZE = 50;

const computeSuggestions = async (query: string) => {
  const q = query.toLowerCase();
  const equipments = await prisma.echipament.findMany({
    take: SEARCH_SAMPLE_SIZE,
    select: { id: true, nume: true, serie: true },
  });
  const equipmentSuggestions = equipments
    .map((e: any) => ({
      item: e,
      score: Math.min(
        levenshtein(e.nume.toLowerCase(), q),
        levenshtein(e.serie.toLowerCase(), q)
      ),
    }))
    .sort((a: any, b: any) => a.score - b.score)
    .slice(0, MAX_SUGGESTION_ITEMS)
    .map((e: any) => e.item);

  const employees = await prisma.angajat.findMany({
    take: SEARCH_SAMPLE_SIZE,
    select: { id: true, numeComplet: true, functie: true, email: true },
  });
  const employeeSuggestions = employees
    .map((a: any) => ({
      item: a,
      score: Math.min(
        levenshtein(a.numeComplet.toLowerCase(), q),
        levenshtein((a.functie || '').toLowerCase(), q),
        levenshtein((a.email || '').toLowerCase(), q)
      ),
    }))
    .sort((a: any, b: any) => a.score - b.score)
    .slice(0, MAX_SUGGESTION_ITEMS)
    .map((a: any) => a.item);

  return { echipamente: equipmentSuggestions, angajati: employeeSuggestions };
};