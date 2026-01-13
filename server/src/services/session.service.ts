import jwt, { SignOptions } from "jsonwebtoken";
import { createHash, randomUUID } from "crypto";
import { prisma } from "../lib/prisma";
import { env } from "../config";
import {
  computeExpiresAt,
  getClientIp,
  parseUserAgentInfo,
  resolveGeoLocation,
} from "../utils/session";

export interface SessionContext {
  userAgent?: string;
  ipAddress?: string;
  forwardedFor?: string | string[];
}

export interface SessionPayload {
  id: number;
  email: string;
  role: string;
  nume: string;
  prenume: string;
  functie: string;
}

export interface SessionCreationResult {
  token: string;
  sessionId: string;
  expiresAt: Date | null;
}

export const createSessionForUser = async (
  payload: SessionPayload,
  context: SessionContext = {}
): Promise<SessionCreationResult> => {
  const sessionId = randomUUID();
  const secret = process.env.JWT_SECRET ?? env.JWT_SECRET;
  const expiresIn = env.JWT_EXPIRES_IN as SignOptions["expiresIn"];
  const options: SignOptions = { expiresIn };
  const tokenPayload = { ...payload, sessionId };
  const token = jwt.sign(tokenPayload, secret, options);
  const tokenHash = createHash("sha256").update(token).digest("hex");

  const parsedAgent = parseUserAgentInfo(context.userAgent);
  const clientIp = getClientIp(context.ipAddress, context.forwardedFor);
  const location = resolveGeoLocation(clientIp);
  const expiresAt = computeExpiresAt(env.JWT_EXPIRES_IN);

  await prisma.session.create({
    data: {
      id: sessionId,
      userId: payload.id,
      tokenHash,
      userAgent: context.userAgent ?? null,
      deviceName: parsedAgent.deviceName ?? null,
      deviceType: parsedAgent.deviceType ?? null,
      osName: parsedAgent.osName ?? null,
      browserName: parsedAgent.browserName ?? null,
      ipAddress: clientIp ?? null,
      locationCity: location.locationCity ?? null,
      locationCountry: location.locationCountry ?? null,
      expiresAt,
    },
  });

  return { token, sessionId, expiresAt };
};

export const touchSession = async (
  sessionId: string,
  context: SessionContext = {}
) => {
  const clientIp = getClientIp(context.ipAddress, context.forwardedFor);

  return prisma.session.update({
    where: { id: sessionId },
    data: {
      lastActive: new Date(),
      ...(clientIp ? { ipAddress: clientIp } : {}),
    },
  });
};

export const deleteSessionById = async (sessionId: string) => {
  try {
    await prisma.session.delete({ where: { id: sessionId } });
  } catch (err) {
    if ((err as { code?: string }).code !== "P2025") {
      throw err;
    }
  }
};

export const getSessionsForUser = (userId: number) => {
  return prisma.session.findMany({
    where: { userId },
    orderBy: { lastActive: "desc" },
  });
};
