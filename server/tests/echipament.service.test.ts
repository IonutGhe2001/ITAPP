import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { updateEchipament } from '../src/services/echipament.service';
import { creeazaProcesVerbalCuEchipamente } from '../src/services/procesVerbal.service';

const tx = {
  echipament: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
  },
};

jest.mock('../src/lib/prisma', () => ({
  prisma: {
    $transaction: jest.fn((fn: any) => fn(tx)),
  },
}));

jest.mock('../src/services/procesVerbal.service', () => ({
  creeazaProcesVerbalCuEchipamente: jest.fn(),
}));

const mockedProcesVerbal = jest.mocked(creeazaProcesVerbalCuEchipamente);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('updateEchipament', () => {
  it('assigns equipment to employee without generating proces verbal', async () => {
    tx.echipament.findUnique.mockResolvedValue({ id: 'e1', tip: 'T', serie: 'S', angajatId: null });
    tx.echipament.update.mockResolvedValue({ id: 'e1', angajatId: 'a1' });
    mockedProcesVerbal.mockResolvedValue({ procesVerbal: { id: 'pv1' } } as any);

    const res = await updateEchipament('e1', { angajatId: 'a1' });

    expect(mockedProcesVerbal).not.toHaveBeenCalled();
    expect(res).toEqual({ id: 'e1', angajatId: 'a1' });
  });

  it('removes employee without generating proces verbal', async () => {
    tx.echipament.findUnique.mockResolvedValue({ id: 'e1', tip: 'T', serie: 'S', angajatId: 'a1' });
    tx.echipament.update.mockResolvedValue({ id: 'e1', angajatId: null });
    mockedProcesVerbal.mockResolvedValue({ procesVerbal: { id: 'pv2' } } as any);

    const res = await updateEchipament('e1', { angajatId: null });

    expect(mockedProcesVerbal).not.toHaveBeenCalled();
    expect(res).toEqual({ id: 'e1', angajatId: null });
  });

  it('changes employee without generating proces verbal', async () => {
    tx.echipament.findUnique.mockResolvedValue({ id: 'e1', tip: 'T', serie: 'S', angajatId: 'a1' });
    tx.echipament.update.mockResolvedValue({ id: 'e1', angajatId: 'a2' });
    mockedProcesVerbal.mockResolvedValue({ procesVerbal: { id: 'pv3' } } as any);

    const res = await updateEchipament('e1', { angajatId: 'a2' });

    expect(mockedProcesVerbal).not.toHaveBeenCalled();
    expect(res).toEqual({ id: 'e1', angajatId: 'a2' });
  });
});