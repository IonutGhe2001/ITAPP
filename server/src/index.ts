import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import path from "path";
import compression from "compression";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler";
import { logRequest } from "./utils/logger"; 

import authRoutes from "./routes/auth";
import echipamenteRoutes from "./routes/echipamente";
import angajatiRoutes from "./routes/angajati";
import evenimenteRoutes from "./routes/evenimente";
import proceseVerbaleRoutes from "./routes/proceseVerbale";
import importRoutes from "./routes/import";


dotenv.config();

const app = express();

// Global Middlewares
// When using credentials the origin cannot be "*". Default to the frontend
// development URL if no environment variable is provided.
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .filter(Boolean);
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(helmet());
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
app.use("/api/auth/login", loginLimiter);
 app.use(logRequest);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/echipamente", echipamenteRoutes);
app.use("/api/angajati", angajatiRoutes);
app.use("/api/evenimente", evenimenteRoutes);
app.use("/api/procese-verbale", proceseVerbaleRoutes);
app.use("/api/import", importRoutes);

// Error handler middleware (final)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
