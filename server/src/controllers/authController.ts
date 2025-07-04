import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import Joi from "joi";

const prisma = new PrismaClient();

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Email invalid" });
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return res.status(401).json({ message: "Parolă incorectă" });
    }

    const expiresIn: string = process.env.JWT_EXPIRES_IN || "1d";

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        nume: user.nume,
        prenume: user.prenume,
        functie: user.functie,
      },
      process.env.JWT_SECRET as string,
      { expiresIn } as SignOptions  
    );

    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ message: "Eroare internă la login" });
  }
};

export const getMe = (req: Request, res: Response) => {
  const user = (req as any).user;

  if (!user) {
    return res.status(401).json({ message: "Neautentificat" });
  }

  const { id, email, role, nume, prenume, functie } = user;
  return res.json({ id, email, role, nume, prenume, functie });
};
