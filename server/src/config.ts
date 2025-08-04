import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(5000),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  JWT_SECRET: z.string().default("test_secret"),
  JWT_EXPIRES_IN: z.string().default("1d"),
  IMPORT_CONCURRENCY_LIMIT: z.coerce.number().default(10),
  PV_GENERATION_MODE: z.enum(["manual", "auto"]).default("auto"),
  LOG_LEVEL: z.string().default("info"),
});

export const env = envSchema.parse(process.env);