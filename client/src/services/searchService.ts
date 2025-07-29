import { useQuery } from "@tanstack/react-query";
import api from "./api";
import type { Echipament, Angajat } from "@/features/equipment/types";

export interface GlobalSearchData {
  echipamente: Echipament[];
  angajati: Angajat[];
  suggestions?: {
    echipamente: Echipament[];
    angajati: Angajat[];
  };
}

export const useGlobalSearch = (query: string) =>
  useQuery<GlobalSearchData>({
    queryKey: ["global-search", query],
    queryFn: async () =>
      (await api.get("/search", { params: { q: query } })).data,
    enabled: !!query.trim(),
  });