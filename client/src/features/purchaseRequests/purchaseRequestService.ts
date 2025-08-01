import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import type { PurchaseRequestInput, PurchaseRequestStatus } from "./types";

export const useCreatePurchaseRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PurchaseRequestInput) =>
      api.post("/purchase-requests", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-requests"] });
    },
  });
};

export const useUpdatePurchaseRequestStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: PurchaseRequestStatus }) =>
      api.patch(`/purchase-requests/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-requests"] });
    },
  });
};