import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";

const prisma = new PrismaClient();

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