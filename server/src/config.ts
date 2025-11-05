import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production", "staging"])
    .default("development"),
  PORT: z.coerce.number().default(8080),
  CORS_ORIGIN: z
    .string()
    .default("http://localhost:5173,http://localhost:3000"),
  FRONTEND_ROOT: z.string().default("http://localhost:3000"),
  JWT_SECRET: z.string().default("test_secret"),
  JWT_EXPIRES_IN: z.string().default("1d"),
  AUTH_DISABLED: z
    .string()
    .default("false")
    .transform((value) => value.toLowerCase()),
  TEST_LOGIN_SECRET: z.string().default(""),
  IMPORT_CONCURRENCY_LIMIT: z.coerce.number().default(10),
  PV_GENERATION_MODE: z.enum(["manual", "auto"]).default("auto"),
  LOG_LEVEL: z.string().default("info"),
});

export const env = envSchema.parse(process.env);
