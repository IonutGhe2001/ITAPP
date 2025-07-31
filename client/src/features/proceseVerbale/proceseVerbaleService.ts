export type ProcesVerbalTip = 'PREDARE_PRIMIRE' | 'RESTITUIRE' | 'SCHIMB';

import api from '@/services/api';

export async function genereazaProcesVerbal(
  angajatId: string,
  tip: ProcesVerbalTip
): Promise<string> {
  const res = await api.post(
    '/procese-verbale',
    { angajatId, tip },
    { responseType: 'blob' }
  );
  const file = new Blob([res.data], { type: 'application/pdf' });
  return URL.createObjectURL(file);
}