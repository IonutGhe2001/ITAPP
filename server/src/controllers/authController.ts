import { Request, Response } from "express";
import {
  updateUser,
  authenticateUser,
  registerUser,
  getUserById,
  revokeSession,
} from "../services/auth.service";
import type { UserUpdateData } from "../services/auth.service";
import type { SessionContext } from "../services/session.service";
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
    const sessionContext: SessionContext = {
      userAgent: req.get("user-agent") ?? undefined,
      ipAddress: req.ip,
      forwardedFor: req.headers["x-forwarded-for"],
    };

    const authResult = await authenticateUser(email, password, sessionContext);

    if (!authResult) {
      return res
        .status(401)
        .json({ message: "Date de autentificare invalide" });
    }

    res.cookie("token", authResult.token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.json({
      success: true,
      token: authResult.token,
      sessionId: authResult.sessionId,
      expiresAt: authResult.expiresAt,
    });
  } catch (err) {
    return res.status(500).json({ message: "Eroare internă" });
  }
};

export const getMe = async (req: Request, res: Response) => {
  // dacă tokenul e de test (venit din /test-login), nu mai interogăm baza de date
  if (req.user?.role === "tester" || req.user?.id === -1) {
    return res.json(req.user);
  }

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
  const {
    nume,
    prenume,
    functie,
    telefon,
    departament,
    locatie,
    profilePicture,
    digitalSignature,
  } = req.body;
  const updateData: Partial<UserUpdateData> = {};

  const assignIfDefined = <K extends keyof UserUpdateData>(
    key: K,
    value: UserUpdateData[K] | undefined
  ) => {
    if (value !== undefined) {
      updateData[key] = value;
    }
  };

  assignIfDefined("nume", nume);
  assignIfDefined("prenume", prenume);
  assignIfDefined("functie", functie);
  assignIfDefined("telefon", telefon);
  assignIfDefined("profilePicture", profilePicture);
  assignIfDefined("digitalSignature", digitalSignature);

  if (departament !== undefined) {
    if (typeof departament === "string") {
      const trimmed = departament.trim();
      updateData.departament = trimmed ? trimmed : null;
    } else {
      updateData.departament = departament;
    }
  }

  if (locatie !== undefined) {
    if (typeof locatie === "string") {
      const trimmed = locatie.trim();
      updateData.locatie = trimmed ? trimmed : null;
    } else {
      updateData.locatie = locatie;
    }
  }

  Object.entries(updateData).forEach(([key, value]) => {
    if (value === undefined || value === "") {
      delete updateData[key as keyof UserUpdateData];
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

export const logout = async (req: Request, res: Response) => {
  const sessionId = req.user?.sessionId;
  if (sessionId) {
    await revokeSession(sessionId).catch(() => undefined);
  }
  res.clearCookie("token");
  return res.json({ success: true });
};
