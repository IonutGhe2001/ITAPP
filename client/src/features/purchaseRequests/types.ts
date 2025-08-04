export type PurchaseRequestStatus = 'PENDING' | 'ORDERED' | 'DELIVERED';

export interface PurchaseRequest {
  id: string;
  equipmentType: string;
  quantity: number;
  status: PurchaseRequestStatus;
  createdAt: string;
}

export interface PurchaseRequestInput {
  equipmentType: string;
  quantity: number;
}
