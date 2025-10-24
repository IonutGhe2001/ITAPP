import { Router, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
import { logger } from "@lib/logger";
import { env } from "../config";

interface TestLoginBody {
  userEmail?: string;
  token?: string;
}

const router = Router();

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

const isTestLoginEnabled = () =>
  env.NODE_ENV === "staging" || env.AUTH_DISABLED === "true";

router.post(
  "/test-login",
  limiter,
  (req: Request<unknown, unknown, TestLoginBody>, res: Response) => {
    if (!isTestLoginEnabled()) {
      return res.status(403).json({ error: "test-login disabled" });
    }

    const providedToken = req.body?.token;
    const expectedToken = env.TEST_LOGIN_SECRET;

    if (env.AUTH_DISABLED !== "true") {
      if (!expectedToken) {
        logger.warn("test-login attempted without TEST_LOGIN_SECRET configured");
        return res.status(500).json({ error: "test-login misconfigured" });
      }

      if (!providedToken || providedToken !== expectedToken) {
        return res.status(401).json({ error: "invalid token" });
      }
    }

    const userEmail = req.body?.userEmail || "tester@local.test";

    const payload = {
      id: -1,
      email: userEmail,
      role: "tester",
      nume: "Test",
      prenume: "User",
      functie: "Tester",
    };

    const sessionToken = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: "10m",
    });

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "none" as const,
      maxAge: 10 * 60 * 1000,
    };

    res.cookie("token", sessionToken, cookieOptions);

    const auditEntry = {
      at: new Date().toISOString(),
      email: userEmail,
      ip: req.ip,
      origin: req.get("origin") ?? "unknown",
    };
    logger.info("[test-login] audit", auditEntry);

    const redirectTarget = env.FRONTEND_ROOT || "/";
    return res.redirect(302, redirectTarget);
  }
);

export default router;