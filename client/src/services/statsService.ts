import { useQuery } from "@tanstack/react-query";
import api from "./api";

export interface OverviewStats {
  echipamente: number;
  inStoc: number;
  alocate: number;
  angajati: number;
}

export const useOverviewStats = () =>
  useQuery<OverviewStats>({
    queryKey: ["overview-stats"],
    queryFn: async () => (await api.get("/echipamente/stats")).data,
  });