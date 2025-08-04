import { useQuery } from '@tanstack/react-query';
import {
  EQUIPMENT_STATUS,
  type EquipmentStatus,
} from "@/features/equipment/types";
import api from './api';

export type OverviewStats = {
  echipamente: number;
  angajati: number;
  } & Record<EquipmentStatus, number>;

export const useOverviewStats = () =>
  useQuery<OverviewStats>({
    queryKey: ['overview-stats'],
    queryFn: async () => {
      const data = (await api.get("/echipamente/stats")).data;

      const statusCounts = Object.values(EQUIPMENT_STATUS).reduce(
        (acc, status) => {
          acc[status] = data[status] ?? 0;
          return acc;
        },
        {} as Record<EquipmentStatus, number>
      );

      return {
        echipamente: data.echipamente,
        angajati: data.angajati,
        ...statusCounts,
      };
    },
  });
