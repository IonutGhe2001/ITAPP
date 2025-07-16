import { Request, Response } from "express";
import { authenticateUser, registerUser } from "../services/auth.service";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const token = await authenticateUser(email, password);

    if (!token) {
      return res.status(401).json({ message: "Email sau parolă incorecte" });
    }

    return res.json({ token });
  } catch (err) {
    return res.status(500).json({ message: "Eroare internă" });
  }
};

export const getMe = (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ message: "Neautentificat" });
  const { id, email, role, nume, prenume, functie } = user;
  return res.json({ id, email, role, nume, prenume, functie });
};

export const register = async (req: Request, res: Response) => {
  try {
    const user = await registerUser(req.body);
    return res.status(201).json({ message: "Cont creat cu succes", userId: user.id });
  } catch (err: any) {
    console.error("Eroare la înregistrare:", err);
    return res.status(400).json({ error: err.message || "Eroare la creare cont" });
  }
};
