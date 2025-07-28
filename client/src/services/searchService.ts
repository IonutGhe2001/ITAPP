import { useQuery } from "@tanstack/react-query";
import api from "./api";

export const useGlobalSearch = (query: string) =>
  useQuery({
    queryKey: ["global-search", query],
    queryFn: async () =>
      (await api.get("/search", { params: { q: query } })).data,
    enabled: !!query.trim(),
  });