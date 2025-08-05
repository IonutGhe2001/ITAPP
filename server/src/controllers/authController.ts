import { Request, Response } from "express";
import {
  updateUser,
  authenticateUser,
  registerUser,
  getUserById,
  UserUpdateData,
} from "../services/auth.service";
import { logger } from "@lib/logger";
import { env } from "../config";
import { loginSchema } from "../validators/auth.validator";

export const login = async (req: Request, res: Response) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res
        .status(401)
        .json({ message: "Date de autentificare invalide" });
    }
    
    const { email, password } = req.body;
    const token = await authenticateUser(email, password);

    if (!token) {
      return res
        .status(401)
        .json({ message: "Date de autentificare invalide" });
    }

    res.cookie("token", token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.json({ success: true, token });
  } catch (err) {
    return res.status(500).json({ message: "Eroare internă" });
  }
};

export const getMe = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  try {
    const user = await getUserById(Number(userId));
    if (!user)
      return res.status(404).json({ message: "Utilizatorul nu a fost găsit" });
    return res.json(user);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Eroare la preluarea utilizatorului" });
  }
};

export const updateMe = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { nume, prenume, functie, telefon, profilePicture, digitalSignature } =
    req.body;
  const updateData: UserUpdateData = {
    nume,
    prenume,
    functie,
    telefon,
    profilePicture,
    digitalSignature,
  };
  Object.keys(updateData).forEach((key) => {
    const typedKey = key as keyof UserUpdateData;
    if (updateData[typedKey] === undefined || updateData[typedKey] === "") {
      delete updateData[typedKey];
    }
  });

  try {
    const updatedUser = await updateUser(userId, updateData);
    return res.json(updatedUser);
  } catch (err) {
    const error = err as Error;
    return res
      .status(400)
      .json({ message: error.message || "Eroare la actualizarea profilului" });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const user = await registerUser(req.body);
    return res
      .status(201)
      .json({ message: "Cont creat cu succes", userId: user.id });
  } catch (err) {
    const error = err as Error;
    logger.error("Eroare la înregistrare:", error);
    return res
      .status(400)
      .json({ error: error.message || "Eroare la creare cont" });
  }
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie("token");
  return res.json({ success: true });
};
