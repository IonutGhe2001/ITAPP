import api from "./api";

// Tipuri de bază
export type EvenimentData = {
  titlu: string;
  ora: string;
  data: Date;
};

export type Eveniment = EvenimentData & {
  id: number;
};

// 🔍 Obține toate evenimentele
export const fetchEvenimente = (token: string): Promise<Eveniment[]> => {
  return api.get("/evenimente", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(res => res.data);
};

// ➕ Creează un nou eveniment
export const createEveniment = (data: EvenimentData, token: string): Promise<Eveniment> => {
  return api.post("/evenimente", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(res => res.data);
};

// 📝 Actualizează un eveniment existent
export const updateEveniment = (id: number, data: EvenimentData, token: string): Promise<Eveniment> => {
  return api.patch(`/evenimente/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(res => res.data);
};

// ❌ Șterge un eveniment
export const deleteEveniment = (id: number, token: string): Promise<void> => {
  return api.delete(`/evenimente/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(res => res.data);
};