import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import {
  getEchipamenteCache,
  setEchipamenteCache,
} from "@/utils/storage";
import type {
  Echipament,
  EchipamentInput,
  EchipamentUpdateInput,
} from "./types";


export const useEchipamente = () =>
  useQuery({
    queryKey: ["echipamente"],
    queryFn: async () => (await api.get("/echipamente")).data as Echipament[],
    initialData: getEchipamenteCache(),
    onSuccess: (data: Echipament[]) => {
      setEchipamenteCache(data)
    },
  })

export const useCreateEchipament = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: EchipamentInput) => api.post("/echipamente", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["echipamente"] });
    },
  });
};

export const useUpdateEchipament = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EchipamentUpdateInput }) =>
      api.put(`/echipamente/${id}`, data).then((r) => r.data as Echipament),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["echipamente"] });
    },
  });
};

export const useDeleteEchipament = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/echipamente/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["echipamente"] });
    },
  });
};
