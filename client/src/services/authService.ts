import axios from "axios";
import api from "./api";

export const login = async (email: string, password: string) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data.token;
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const res = await axios.get("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
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
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Neautentificat");

  const res = await axios.patch("/api/auth/me", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
