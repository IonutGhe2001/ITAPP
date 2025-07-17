import api from "./api";

export const getEchipamente = () => api.get("/echipamente");
export const createEchipament = (data: any) => api.post("/echipamente", data);
export const updateEchipament = async (id: string, data: any) => {
  const res = await api.put(`/echipamente/${id}`, data);
  return res.data; 
};
export const deleteEchipament = (id: string) => api.delete(`/echipamente/${id}`);