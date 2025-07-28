import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";

export const useEchipamente = () =>
  useQuery({
    queryKey: ["echipamente"],
    queryFn: async () => (await api.get("/echipamente")).data,
  });

export const useCreateEchipament = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post("/echipamente", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["echipamente"] });
    },
  });
};

export const useUpdateEchipament = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api.put(`/echipamente/${id}`, data).then((r) => r.data),
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
