import { useQuery } from "@tanstack/react-query";
import { EQUIPMENT_STATUS } from "@/features/equipment/types";
import api from "./api";

export interface OverviewStats {
  echipamente: number;
  angajati: number;
  [EQUIPMENT_STATUS.IN_STOC]: number;
  [EQUIPMENT_STATUS.ALOCAT]: number;
}

export const useOverviewStats = () =>
  useQuery<OverviewStats>({
    queryKey: ["overview-stats"],
    queryFn: async () => (await api.get("/echipamente/stats")).data,
  });