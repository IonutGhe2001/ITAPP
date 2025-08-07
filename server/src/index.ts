import express from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import compression from "compression";
import cookieParser from "cookie-parser";
import { logger } from "@lib/logger";
import { errorHandler } from "./middlewares/errorHandler";
import { logRequest } from "./utils/logger";
import { initWebSocket } from "./lib/websocket";
import { env } from "./config";

import authRoutes from "./routes/auth";
import echipamenteRoutes from "./routes/echipamente";
import angajatiRoutes from "./routes/angajati";
import evenimenteRoutes from "./routes/evenimente";
import proceseVerbaleRoutes from "./routes/proceseVerbale";
import importRoutes from "./routes/import";
import searchRoutes from "./routes/search";
import updatesRoutes from "./routes/updates";
import equipmentChangesRoutes from "./routes/equipmentChanges";
import configRoutes from "./routes/config";
import departmentConfigRoutes from "./routes/departmentConfig";
import reportsRoutes from "./routes/reports";
import purchaseRequestRoutes from "./routes/purchaseRequests";
import onboardingRoutes from "./routes/onboarding";

const app = express();
const server = http.createServer(app);

// Global Middlewares
// When using credentials the origin cannot be "*". Default to the frontend
// development URL if no environment variable is provided.
const allowedOrigins = env.CORS_ORIGIN.split(",").filter(Boolean);
initWebSocket(server, allowedOrigins);
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "blob:", ...allowedOrigins],
        frameAncestors: ["'self'", ...allowedOrigins],
      },
    },
  })
);
app.use(cookieParser());
app.use(compression());

const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minut
  max: 20, // max 20 cereri
  message: "Prea multe încercări. Încearcă din nou mai târziu.",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(
  "/assets",
  express.static(path.join(__dirname, "../public/assets"), {
    maxAge: "1y",
    etag: false,
  })
);
app.use(
  "/procese-verbale",
  express.static(path.join(__dirname, "../public/procese-verbale"), {
    maxAge: "1y",
    etag: false,
  })
);
app.use(
  "/equipment-documents",
  express.static(path.join(__dirname, "../public/equipment-documents"), {
    maxAge: "1y",
    etag: false,
  })
);
app.use(
  "/equipment-images",
  express.static(path.join(__dirname, "../public/equipment-images"), {
    maxAge: "1y",
    etag: false,
  })
);
app.use("/api/auth/login", loginLimiter);
app.use(logRequest);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/echipamente", echipamenteRoutes);
app.use("/api/angajati", angajatiRoutes);
app.use("/api/evenimente", evenimenteRoutes);
app.use("/api/procese-verbale", proceseVerbaleRoutes);
app.use("/api/import", importRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/updates", updatesRoutes);
app.use("/api/purchase-requests", purchaseRequestRoutes);
app.use("/api/equipment-changes", equipmentChangesRoutes);
app.use("/config", configRoutes);
app.use("/api/department-configs", departmentConfigRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/onboarding", onboardingRoutes);

// Error handler middleware (final)
app.use(errorHandler);

const PORT = env.PORT;
server.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
