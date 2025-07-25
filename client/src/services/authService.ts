import api from "./api";

export const login = async (email: string, password: string) => {
  await api.post("/auth/login", { email, password });
};

export const getCurrentUser = async () => {
  try {
   const res = await api.get("/auth/me");
    return res.data;
  } catch (error) {
    console.error("Eroare la /me:", error);
    return null;
  }
};

export const updateCurrentUser = async (data: Partial<{
  nume: string;
  prenume: string;
  functie: string;
  telefon?: string;
  profilePicture?: string;
}>) => {

   const res = await api.patch("/auth/me", data);

  return res.data;
};

export const logout = async () => {
  await api.post("/auth/logout");
};
