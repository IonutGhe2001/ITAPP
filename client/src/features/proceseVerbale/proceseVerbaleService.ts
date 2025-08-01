export type ProcesVerbalTip = 'PREDARE_PRIMIRE' | 'RESTITUIRE' | 'SCHIMB';

import api from '@/services/api';

export async function genereazaProcesVerbal(
  angajatId: string,
   tip: ProcesVerbalTip,
  opts?: { predate?: string[]; primite?: string[]; fromChanges?: boolean }
): Promise<string> {
  const url = opts?.fromChanges
    ? '/procese-verbale/from-changes'
    : '/procese-verbale';

  const body = opts?.fromChanges
    ? { angajatId }
    : {
        angajatId,
        tip,
        echipamentePredate: opts?.predate,
        echipamentePrimite: opts?.primite,
      };

  const res = await api.post(url, body, { responseType: 'blob' });
  const file = new Blob([res.data], { type: 'application/pdf' });
  return URL.createObjectURL(file);
}