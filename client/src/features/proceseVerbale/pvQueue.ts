import type { ProcesVerbalTip } from './proceseVerbaleService';

const QUEUE_KEY = 'pvQueue';

export function queueProcesVerbal(
  angajatId: string,
  tip: ProcesVerbalTip,
  opts?: { predate?: string[]; primite?: string[] }
) {
  const existing = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
  existing.push({ angajatId, tip, ...opts });
  localStorage.setItem(QUEUE_KEY, JSON.stringify(existing));
}