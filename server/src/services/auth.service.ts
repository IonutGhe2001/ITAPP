import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";
import {
  createSessionForUser,
  deleteSessionById,
  type SessionContext,
} from "./session.service";

export interface AuthResult {
  token: string;
  sessionId: string;
  expiresAt: Date | null;
}

export const authenticateUser = async (
  email: string,
  password: string,
  context: SessionContext = {}
): Promise<AuthResult | null> => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return null;

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  });

  const session = await createSessionForUser(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      nume: user.nume,
      prenume: user.prenume,
      functie: user.functie,
    },
    context
  );

  return session;
};

export const registerUser = async (input: {
  email: string;
  password: string;
  nume: string;
  prenume: string;
  functie: string;
  role: string;
}): Promise<Awaited<ReturnType<typeof prisma.user.create>>> => {
  const { email, password, nume, prenume, functie, role } = input;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("Email deja înregistrat");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      nume,
      prenume,
      functie,
      role,
    },
  });

  return newUser;
};

export interface UserUpdateData {
  nume?: string;
  prenume?: string;
  functie?: string;
  telefon?: string;
  departament?: string | null;
  locatie?: string | null;
  profilePicture?: string | null;
  digitalSignature?: string | null;
}

export const updateUser = (id: number, data: Partial<UserUpdateData>) => {
  return prisma.user.update({
    where: { id },
    data,
  });
};

export const getUserById = (id: number) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      role: true,
      nume: true,
      prenume: true,
      functie: true,
      telefon: true,
      departament: true,
      locatie: true,
      profilePicture: true,
      digitalSignature: true,
      lastLogin: true,
    },
  });
};

export const revokeSession = async (sessionId: string) => {
  await deleteSessionById(sessionId);
};
