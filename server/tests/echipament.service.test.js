let tx: any;

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

describe('updateEchipament', () => {
  it('assigns equipment to employee without generating proces verbal', async () => {
    tx.echipament.findUnique.mockResolvedValue({ id: 'e1', tip: 'T', serie: 'S', angajatId: null });
    tx.echipament.update.mockResolvedValue({ id: 'e1', angajatId: 'a1' });
    creeazaProcesVerbalCuEchipamente.mockResolvedValue({ procesVerbal: { id: 'pv1' } });

    const res = await updateEchipament('e1', { angajatId: 'a1' });

    expect(creeazaProcesVerbalCuEchipamente).not.toHaveBeenCalled();
    expect(res).toEqual({ id: 'e1', angajatId: 'a1' });
  });

  it('removes employee without generating proces verbal', async () => {
    tx.echipament.findUnique.mockResolvedValue({ id: 'e1', tip: 'T', serie: 'S', angajatId: 'a1' });
    tx.echipament.update.mockResolvedValue({ id: 'e1', angajatId: null });
    creeazaProcesVerbalCuEchipamente.mockResolvedValue({ procesVerbal: { id: 'pv2' } });

    const res = await updateEchipament('e1', { angajatId: null });

    expect(creeazaProcesVerbalCuEchipamente).not.toHaveBeenCalled();
    expect(res).toEqual({ id: 'e1', angajatId: null });
  });

  it('changes employee without generating proces verbal', async () => {
    tx.echipament.findUnique.mockResolvedValue({ id: 'e1', tip: 'T', serie: 'S', angajatId: 'a1' });
    tx.echipament.update.mockResolvedValue({ id: 'e1', angajatId: 'a2' });
    creeazaProcesVerbalCuEchipamente.mockResolvedValue({ procesVerbal: { id: 'pv3' } });

    const res = await updateEchipament('e1', { angajatId: 'a2' });

    expect(creeazaProcesVerbalCuEchipamente).not.toHaveBeenCalled();
    expect(res).toEqual({ id: 'e1', angajatId: 'a2' });
  });
});