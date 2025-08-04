import api from '@/services/api';

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
  return api.get('/evenimente').then((res) => res.data);
};

// ➕ Creează un nou eveniment
export const createEveniment = (data: EvenimentData): Promise<Eveniment> => {
  return api.post('/evenimente', data).then((res) => res.data);
};

// 📝 Actualizează un eveniment existent
export const updateEveniment = (id: number, data: EvenimentData): Promise<Eveniment> => {
  return api.patch(`/evenimente/${id}`, data).then((res) => res.data);
};

// ❌ Șterge un eveniment
export const deleteEveniment = (id: number): Promise<void> => {
  return api.delete(`/evenimente/${id}`).then((res) => res.data);
};
