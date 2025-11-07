import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config";
import { touchSession } from "../services/session.service";

export interface AuthPayload {
  id: number;
  email: string;
  role: string;
  nume: string;
  prenume: string;
  functie: string;
  sessionId?: string;
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined;
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: "Token lipsă" });
  }

  try {
    const secret = process.env.JWT_SECRET ?? env.JWT_SECRET;
    const decoded = jwt.verify(token, secret) as AuthPayload;
    req.user = decoded;

    if (decoded.sessionId) {
      try {
        await touchSession(decoded.sessionId, {
          ipAddress: req.ip,
          forwardedFor: req.headers["x-forwarded-for"],
        });
      } catch (sessionErr) {
        if ((sessionErr as { code?: string }).code === "P2025") {
          return res.status(401).json({ message: "Sesiune invalidă" });
        }
        throw sessionErr;
      }
    }
    
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid" });
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user || !roles.includes(user.role)) {
      return res
        .status(403)
        .json({ message: "Acces interzis: rol insuficient" });
    }

    next();
  };
};
