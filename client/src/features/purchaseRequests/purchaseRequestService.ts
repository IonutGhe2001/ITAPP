import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import http from '@/services/http';
import type {
  PurchaseRequest,
  PurchaseRequestInput,
  PurchaseRequestStatus,
} from './types';

export const useCreatePurchaseRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PurchaseRequestInput) =>
      http.post<PurchaseRequest>('/purchase-requests', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PURCHASE_REQUESTS });
    },
  });
};

export const useUpdatePurchaseRequestStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: PurchaseRequestStatus }) =>
      http.patch<PurchaseRequest>(`/purchase-requests/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PURCHASE_REQUESTS });
    },
  });
};
