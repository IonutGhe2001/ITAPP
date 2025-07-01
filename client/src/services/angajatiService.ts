import api from "./api";

export const getAngajati = () => api.get("/angajati");
export const createAngajat = (data: any) => api.post("/angajati", data);
export const updateAngajat = (id: string, data: any) => api.put(`/angajati/${id}`, data);
export const deleteAngajat = (id: string) => api.delete(`/angajati/${id}`);
