import type { ProcesVerbalTip } from './proceseVerbaleService';

const QUEUE_KEY = 'pvQueue';

export interface PvQueueItem {
  angajatId: string;
  tip: ProcesVerbalTip;
  predate?: string[];
  primite?: string[];
}

function readQueue(): PvQueueItem[] {
  return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
}

function writeQueue(items: PvQueueItem[]) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(items));
}

export function queueProcesVerbal(
  angajatId: string,
  tip: ProcesVerbalTip,
  opts?: { predate?: string[]; primite?: string[] }
) {
  const existing = readQueue();
  existing.push({ angajatId, tip, ...opts });
  writeQueue(existing);
}

export function getQueue(): PvQueueItem[] {
  return readQueue();
}

export function clearQueue() {
  localStorage.removeItem(QUEUE_KEY);
}

export function removeFromQueue(angajatId: string) {
  const filtered = readQueue().filter((q) => q.angajatId !== angajatId);
  writeQueue(filtered);
}

export function getQueueCount() {
  return readQueue().length;
}