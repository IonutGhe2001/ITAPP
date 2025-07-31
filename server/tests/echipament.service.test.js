const ProcesVerbalTip = {
  PREDARE_PRIMIRE: 'PREDARE_PRIMIRE',
  RESTITUIRE: 'RESTITUIRE',
  SCHIMB: 'SCHIMB',
} as const;
let tx: any;

jest.mock('@prisma/client', () => ({
  ProcesVerbalTip: {
    PREDARE_PRIMIRE: 'PREDARE_PRIMIRE',
    RESTITUIRE: 'RESTITUIRE',
    SCHIMB: 'SCHIMB',
  },
  PrismaClient: jest.fn(),
}));

jest.mock('../src/lib/prisma', () => {
  tx = {
    echipament: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };
  return {
    prisma: {
      $transaction: jest.fn((fn: any) => fn(tx)),
    },
  };
});

jest.mock('../src/services/procesVerbal.service', () => ({
  creeazaProcesVerbalCuEchipamente: jest.fn(),
}));

const { updateEchipament } = require('../src/services/echipament.service');
const { creeazaProcesVerbalCuEchipamente } = require('../src/services/procesVerbal.service');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('updateEchipament proces verbal', () => {
  it('creates PREDARE_PRIMIRE when assigning equipment', async () => {
    tx.echipament.findUnique.mockResolvedValue({ id: 'e1', tip: 'T', serie: 'S', angajatId: null });
    tx.echipament.update.mockResolvedValue({ id: 'e1', angajatId: 'a1' });
    creeazaProcesVerbalCuEchipamente.mockResolvedValue({ id: 'pv1' });

    const res = await updateEchipament('e1', { angajatId: 'a1' });

    expect(creeazaProcesVerbalCuEchipamente).toHaveBeenCalledWith('a1', undefined, ProcesVerbalTip.PREDARE_PRIMIRE);
    expect(res).toEqual({ echipament: { id: 'e1', angajatId: 'a1' }, procesVerbal: { id: 'pv1' } });
  });

  it('creates RESTITUIRE when removing employee', async () => {
    tx.echipament.findUnique.mockResolvedValue({ id: 'e1', tip: 'T', serie: 'S', angajatId: 'a1' });
    tx.echipament.update.mockResolvedValue({ id: 'e1', angajatId: null });
    creeazaProcesVerbalCuEchipamente.mockResolvedValue({ id: 'pv2' });

    const res = await updateEchipament('e1', { angajatId: null });

    expect(creeazaProcesVerbalCuEchipamente).toHaveBeenCalledWith('a1', undefined, ProcesVerbalTip.RESTITUIRE);
    expect(res).toEqual({ echipament: { id: 'e1', angajatId: null }, procesVerbal: { id: 'pv2' } });
  });

  it('creates SCHIMB when changing employee', async () => {
    tx.echipament.findUnique.mockResolvedValue({ id: 'e1', tip: 'T', serie: 'S', angajatId: 'a1' });
    tx.echipament.update.mockResolvedValue({ id: 'e1', angajatId: 'a2' });
    creeazaProcesVerbalCuEchipamente.mockResolvedValue({ id: 'pv3' });

    const res = await updateEchipament('e1', { angajatId: 'a2' });

    expect(creeazaProcesVerbalCuEchipamente).toHaveBeenCalledWith('a2', undefined, ProcesVerbalTip.SCHIMB);
    expect(res).toEqual({ echipament: { id: 'e1', angajatId: 'a2' }, procesVerbal: { id: 'pv3' } });
  });
});