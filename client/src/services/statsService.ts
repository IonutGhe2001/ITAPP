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

      return {
        echipamente: data.echipamente,
        angajati: data.angajati,
        [EQUIPMENT_STATUS.IN_STOC]: data[EQUIPMENT_STATUS.IN_STOC],
        [EQUIPMENT_STATUS.ALOCAT]: data[EQUIPMENT_STATUS.ALOCAT],
      };
    },
  });
