import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { deleteAngajat } from '../src/services/angajat.service';

const tx = {
  echipament: {
    findMany: jest.fn<(...args: any[]) => Promise<any>>(),
    updateMany: jest.fn<(...args: any[]) => Promise<any>>(),
  },
  equipmentChange: {
    deleteMany: jest.fn<(...args: any[]) => Promise<any>>(),
  },
  angajat: {
    delete: jest.fn<(...args: any[]) => Promise<any>>(),
  },
};

jest.mock('../src/lib/prisma', () => ({
  prisma: {
    $transaction: jest.fn((fn: any) => fn(tx)),
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('deleteAngajat', () => {
  it('returns equipment to stock and removes employee', async () => {
    tx.echipament.findMany.mockResolvedValue([{ id: 'e1' }]);

    await deleteAngajat('a1');

    expect(tx.echipament.updateMany).toHaveBeenCalledWith({
      where: { angajatId: 'a1' },
      data: { angajatId: null, stare: 'in_stoc' },
    });
    expect(tx.equipmentChange.deleteMany).toHaveBeenCalledWith({
      where: { angajatId: 'a1' },
    });
    expect(tx.angajat.delete).toHaveBeenCalledWith({ where: { id: 'a1' } });
  });

  it('deletes employee even when no equipment is assigned', async () => {
    tx.echipament.findMany.mockResolvedValue([]);

    await deleteAngajat('a2');

    expect(tx.echipament.updateMany).not.toHaveBeenCalled();
    expect(tx.equipmentChange.deleteMany).toHaveBeenCalledWith({
      where: { angajatId: 'a2' },
    });
    expect(tx.angajat.delete).toHaveBeenCalledWith({ where: { id: 'a2' } });
  });
});