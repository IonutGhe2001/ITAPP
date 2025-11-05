import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { EQUIPMENT_STATUS, type EquipmentStatus } from '@/features/equipment/types';
import http from './http';

export type OverviewStats = {
  echipamente: number;
  angajati: number;
  } & Record<EquipmentStatus, number>;

export const useOverviewStats = () =>
  useQuery<OverviewStats>({
    queryKey: QUERY_KEYS.OVERVIEW_STATS,
    queryFn: async () => {
      const data = await http.get<Record<string, number>>('/echipamente/stats');

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
