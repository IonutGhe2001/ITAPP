export type ProcesVerbalTip = 'PREDARE_PRIMIRE' | 'RESTITUIRE' | 'SCHIMB';

import http from '@/services/http';

export async function genereazaProcesVerbal(
  angajatId: string,
  tip: ProcesVerbalTip,
  opts?: { predate?: string[]; primite?: string[]; fromChanges?: boolean }
): Promise<string> {
  const url = opts?.fromChanges ? '/procese-verbale/from-changes' : '/procese-verbale';

  const body = opts?.fromChanges
    ? { angajatId }
    : {
        angajatId,
        tip,
        echipamentePredate: opts?.predate,
        echipamentePrimite: opts?.primite,
      };

  const blob = await http.post<Blob>(url, body, { responseType: 'blob' });
  const file = new Blob([blob], { type: 'application/pdf' });
  return URL.createObjectURL(file);
}
