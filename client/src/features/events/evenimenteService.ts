import http from '@/services/http';

// Tipuri de bază
export type EvenimentData = {
  titlu: string;
  ora: string | null;
  data: Date;
  recurrence?: 'none' | 'daily' | 'weekly' | 'monthly';
};

export type Eveniment = EvenimentData & {
  id: number;
};

// 🔍 Obține toate evenimentele
export const fetchEvenimente = (): Promise<Eveniment[]> => {
  return http.get<Eveniment[]>('/evenimente');
};

// ➕ Creează un nou eveniment
export const createEveniment = (data: EvenimentData): Promise<Eveniment> => {
  return http.post<Eveniment>('/evenimente', data);
};

// 📝 Actualizează un eveniment existent
export const updateEveniment = (
  id: number,
  data: EvenimentData
): Promise<Eveniment> => {
  return http.patch<Eveniment>(`/evenimente/${id}`, data);
};

// ❌ Șterge un eveniment
export const deleteEveniment = (id: number): Promise<void> => {
  return http.delete<void>(`/evenimente/${id}`);
};
