import { Request, Response } from "express";
import { updateUser, authenticateUser, registerUser, getUserById } from "../services/auth.service";
import { logger } from "@lib/logger";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const token = await authenticateUser(email, password);

    if (!token) {
      return res.status(401).json({ message: "Email sau parolă incorecte" });
    }

      res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ message: "Eroare internă" });
  }
};

export const getMe = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  try {
    const user = await getUserById(Number(userId));
    if (!user) return res.status(404).json({ message: "Utilizatorul nu a fost găsit" });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: "Eroare la preluarea utilizatorului" });
  }
};

export const updateMe = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { nume, prenume, functie, telefon, profilePicture } = req.body;

  const updateData: any = { nume, prenume, functie, telefon, profilePicture };
  Object.keys(updateData).forEach((key) => {
    if (updateData[key] === undefined || updateData[key] === "") {
      delete updateData[key];
    }
  });

  try {
    const updatedUser = await updateUser(userId, updateData);
    return res.json(updatedUser);
  } catch (err: any) {
    return res.status(400).json({ message: err.message || "Eroare la actualizarea profilului" });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const user = await registerUser(req.body);
    return res.status(201).json({ message: "Cont creat cu succes", userId: user.id });
  } catch (err: any) {
    logger.error("Eroare la înregistrare:", err);
    return res.status(400).json({ error: err.message || "Eroare la creare cont" });
  }
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie("token");
  return res.json({ success: true });
};
