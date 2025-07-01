import api from "./api";

export const getEchipamente = () => api.get("/echipamente");
export const createEchipament = (data: any) => api.post("/echipamente", data);
export const updateEchipament = (id: string, data: any) => api.put(`/echipamente/${id}`, data);
export const deleteEchipament = (id: string) => api.delete(`/echipamente/${id}`);