import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { prisma } from "../lib/prisma";



export const authenticateUser = async (email: string, password: string): Promise<string | null> => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return null;

  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    nume: user.nume,
    prenume: user.prenume,
    functie: user.functie,
  };

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET nu este definit în .env");
  }

  const expiresIn = (process.env.JWT_EXPIRES_IN || "1d") as SignOptions["expiresIn"];

  const options: SignOptions = {
    expiresIn,
  };

  const token = jwt.sign(payload, secret, options);
  return token;
};

export const registerUser = async (input: {
  email: string;
  password: string;
  nume: string;
  prenume: string;
  functie: string;
  role: string;
}): Promise<any> => {
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

export const updateUser = (
  id: string,
  data: Partial<{
    nume: string;
    prenume: string;
    functie: string;
    telefon: string;
    profilePicture: string | null;
    digitalSignature: string | null;
  }>
) => {
  return prisma.user.update({
    where: { id: Number(id) },
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
      profilePicture: true,
      digitalSignature: true,
    },
  });
};
