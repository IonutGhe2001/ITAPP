import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { updateEchipament } from '../src/services/echipament.service';
import { creeazaProcesVerbalCuEchipamente } from '../src/services/procesVerbal.service';

const tx = {
  echipament: {
    findUnique: jest.fn<(...args: any[]) => Promise<any>>(),
    findFirst: jest.fn<(...args: any[]) => Promise<any>>(),
    update: jest.fn<(...args: any[]) => Promise<any>>(),
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

  it('updates technical details', async () => {
    tx.echipament.findUnique.mockResolvedValue({
      id: 'e1',
      tip: 'T',
      serie: 'S',
      angajatId: null,
    });
    tx.echipament.update.mockResolvedValue({ id: 'e1', cpu: 'i7', ram: '16GB' });

    const details = {
      cpu: 'i7',
      ram: '16GB',
      stocare: '512GB',
      os: 'Windows',
      versiuneFirmware: '1.0',
      numarInventar: 'INV-1',
      dataAchizitie: new Date('2024-01-01'),
      garantie: new Date('2025-01-01'),
    } as const;

    const res = await updateEchipament('e1', details);

    expect(tx.echipament.update).toHaveBeenCalledWith({
      where: { id: 'e1' },
      data: expect.objectContaining(details),
      include: { angajat: true },
    });
    expect(res).toEqual({ id: 'e1', cpu: 'i7', ram: '16GB' });
  });

  it('sets defectAt when changing status to mentenanta', async () => {
    tx.echipament.findUnique.mockResolvedValue({
      id: 'e1',
      tip: 'T',
      serie: 'S',
      angajatId: null,
      stare: 'in_stoc',
    });
    const now = new Date();
    tx.echipament.update.mockResolvedValue({ id: 'e1', stare: 'mentenanta', defectAt: now });

    const res = await updateEchipament('e1', { stare: 'mentenanta' });

    expect(tx.echipament.update).toHaveBeenCalledWith({
      where: { id: 'e1' },
      data: expect.objectContaining({ stare: 'mentenanta', defectAt: expect.any(Date) }),
      include: { angajat: true },
    });
    expect(res).toEqual({ id: 'e1', stare: 'mentenanta', defectAt: now });
  });
});