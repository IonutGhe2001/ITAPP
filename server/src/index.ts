import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/errorHandler";
import { logRequest } from "./utils/logger"; 

import authRoutes from "./routes/auth";
import echipamenteRoutes from "./routes/echipamente";
import angajatiRoutes from "./routes/angajati";
import evenimenteRoutes from "./routes/evenimente";
import { authenticate } from "./middlewares/authMiddleware";

dotenv.config();

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(helmet());

const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minut
  max: 20, // max 20 cereri
  message: "Prea multe încercări. Încearcă din nou mai târziu.",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/auth/login", loginLimiter);
 app.use(logRequest);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/echipamente", authenticate, echipamenteRoutes);
app.use("/api/angajati", authenticate, angajatiRoutes);
app.use("/api/evenimente", evenimenteRoutes);

// Error handler middleware (final)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
