import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./api";

export const getAngajati = () => api.get("/angajati");

export const useAngajati = () =>
  useQuery({
    queryKey: ["angajati"],
    queryFn: async () => (await api.get("/angajati")).data,
  });

export const useCreateAngajat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post("/angajati", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["angajati"] });
    },
  });
};

export const useUpdateAngajat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api.put(`/angajati/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["angajati"] });
    },
  });
};

export const useDeleteAngajat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/angajati/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["angajati"] });
    },
  });
};
