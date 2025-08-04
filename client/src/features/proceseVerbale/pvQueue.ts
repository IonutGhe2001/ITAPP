import type { ProcesVerbalTip } from './proceseVerbaleService';

const QUEUE_KEY = 'pvQueue';

export interface PvQueueItem {
  angajatId: string;
  tip: ProcesVerbalTip;
  predate?: string[];
  primite?: string[];
}

function readQueue(): PvQueueItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(QUEUE_KEY);
    return raw ? (JSON.parse(raw) as PvQueueItem[]) : [];
  } catch (error) {
    console.error('Failed to read pv queue from localStorage', error);
    return [];
  }
}

function writeQueue(items: PvQueueItem[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(QUEUE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to write pv queue to localStorage', error);
  }
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
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(QUEUE_KEY);
  } catch (error) {
    console.error('Failed to clear pv queue from localStorage', error);
  }
}

export function removeFromQueue(angajatId: string) {
  const filtered = readQueue().filter((q) => q.angajatId !== angajatId);
  writeQueue(filtered);
}

export function getQueueCount() {
  return readQueue().length;
}
