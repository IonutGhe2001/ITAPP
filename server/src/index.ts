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
import { authenticate } from "./middlewares/authMiddleware";

dotenv.config();

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));
 app.use(logRequest);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/echipamente", authenticate, echipamenteRoutes);
app.use("/api/angajati", authenticate, angajatiRoutes);

// Error handler middleware (final)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
