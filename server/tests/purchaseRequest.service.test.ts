import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { updatePurchaseRequestStatus } from '../src/services/purchaseRequest.service';
import { EQUIPMENT_STATUS } from '../../shared/equipmentStatus';

type EquipmentCreateManyData = {
  nume: string;
  tip: string;
  serie: string;
  stare: string;
};

type EquipmentCreateManyArgs = {
  data: EquipmentCreateManyData[];
};

const tx = {
  purchaseRequest: {
    findUnique: jest.fn<(...args: any[]) => Promise<any>>(),
    update: jest.fn<(...args: any[]) => Promise<any>>(),
  },
  echipament: {
    createMany: jest.fn<(...args: any[]) => Promise<any>>(),
  },
};

jest.mock('../src/lib/prisma', () => ({
  prisma: {
    $transaction: jest.fn((fn: any) => fn(tx)),
  },
}));

const mockedPrisma = jest.requireMock('../src/lib/prisma').prisma as {
  $transaction: jest.Mock;
};

describe('updatePurchaseRequestStatus', () => {
  beforeEach(() => {
    mockedPrisma.$transaction.mockClear();
    tx.purchaseRequest.findUnique.mockReset();
    tx.purchaseRequest.update.mockReset();
    tx.echipament.createMany.mockReset();
  });

  it('creates equipment entries with unique serials for small quantities', async () => {
    tx.purchaseRequest.findUnique.mockResolvedValue({
      id: 'req-small',
      equipmentType: 'Laptop',
      quantity: 2,
      status: 'PENDING',
    });

    tx.purchaseRequest.update.mockImplementation(async ({ data }) => ({
      id: 'req-small',
      equipmentType: 'Laptop',
      quantity: 2,
      status: data.status,
    }));

    tx.echipament.createMany.mockResolvedValue({ count: 2 });

    const updated = await updatePurchaseRequestStatus('req-small', 'DELIVERED');

    expect(mockedPrisma.$transaction).toHaveBeenCalledTimes(1);
    expect(updated).toEqual(
      expect.objectContaining({ id: 'req-small', status: 'DELIVERED' })
    );

    expect(tx.echipament.createMany).toHaveBeenCalledTimes(1);
    const { data } =
      tx.echipament.createMany.mock.calls[0][0] as EquipmentCreateManyArgs;
    expect(data).toHaveLength(2);
    expect(data).toEqual([
      expect.objectContaining({
        nume: 'Laptop',
        tip: 'Laptop',
        serie: 'req-small-1',
        stare: EQUIPMENT_STATUS.IN_STOC,
      }),
      expect.objectContaining({
        nume: 'Laptop',
        tip: 'Laptop',
        serie: 'req-small-2',
        stare: EQUIPMENT_STATUS.IN_STOC,
      }),
    ]);
    const serials = data.map((item: EquipmentCreateManyData) => item.serie);
    expect(new Set(serials).size).toBe(serials.length);
  });

  it('creates equipment entries with unique serials for large quantities', async () => {
    const quantity = 250;
    tx.purchaseRequest.findUnique.mockResolvedValue({
      id: 'req-large',
      equipmentType: 'Monitor',
      quantity,
      status: 'ORDERED',
    });

    tx.purchaseRequest.update.mockImplementation(async ({ data }) => ({
      id: 'req-large',
      equipmentType: 'Monitor',
      quantity,
      status: data.status,
    }));

    tx.echipament.createMany.mockResolvedValue({ count: quantity });

    const updated = await updatePurchaseRequestStatus('req-large', 'DELIVERED');

    expect(mockedPrisma.$transaction).toHaveBeenCalledTimes(1);
    expect(updated).toEqual(
      expect.objectContaining({ id: 'req-large', status: 'DELIVERED' })
    );

    expect(tx.echipament.createMany).toHaveBeenCalledTimes(1);
    const { data } =
      tx.echipament.createMany.mock.calls[0][0] as EquipmentCreateManyArgs;
    expect(data).toHaveLength(quantity);

    const serials = data.map((item: EquipmentCreateManyData) => item.serie);
    expect(new Set(serials).size).toBe(quantity);
    expect(serials[0]).toBe('req-large-1');
    expect(serials[quantity - 1]).toBe(`req-large-${quantity}`);

    data.forEach((item: EquipmentCreateManyData) => {
      expect(item).toEqual(
        expect.objectContaining({
          nume: 'Monitor',
          tip: 'Monitor',
          stare: EQUIPMENT_STATUS.IN_STOC,
        })
      );
    });
  });
});