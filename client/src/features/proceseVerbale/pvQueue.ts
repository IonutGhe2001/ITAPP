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

/**
 * Determines the appropriate PV type based on equipment being returned and received
 * @param predate - Array of equipment IDs being returned/handed back
 * @param primite - Array of equipment IDs being received/assigned
 * @returns The appropriate ProcesVerbalTip for the transaction
 */
function determinePvType(predate: string[], primite: string[]): ProcesVerbalTip {
  if (predate.length > 0 && primite.length > 0) {
    return 'SCHIMB';
  } else if (predate.length > 0) {
    return 'RESTITUIRE';
  } else {
    return 'PREDARE_PRIMIRE';
  }
}

export function queueProcesVerbal(
  angajatId: string,
  tip: ProcesVerbalTip,
  opts?: { predate?: string[]; primite?: string[] }
) {
  const existing = readQueue();
  
  // Find if there's already a queued PV for this employee
  const existingIndex = existing.findIndex((item) => item.angajatId === angajatId);
  
  if (existingIndex !== -1) {
    // Consolidate the changes into the existing queue item
    const existingItem = existing[existingIndex];
    const consolidatedPredate = [
      ...(existingItem.predate || []),
      ...(opts?.predate || []),
    ];
    const consolidatedPrimite = [
      ...(existingItem.primite || []),
      ...(opts?.primite || []),
    ];
    
    // Remove duplicates
    const uniquePredate = Array.from(new Set(consolidatedPredate));
    const uniquePrimite = Array.from(new Set(consolidatedPrimite));
    
    // Determine the correct tip based on what we have
    const consolidatedTip = determinePvType(uniquePredate, uniquePrimite);
    
    // Update the existing item
    existing[existingIndex] = {
      angajatId,
      tip: consolidatedTip,
      predate: uniquePredate.length > 0 ? uniquePredate : undefined,
      primite: uniquePrimite.length > 0 ? uniquePrimite : undefined,
    };
  } else {
    // Add new item to queue
    existing.push({ angajatId, tip, ...opts });
  }
  
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
