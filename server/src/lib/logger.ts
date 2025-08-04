import { createLogger, format, transports } from "winston";

const level = process.env.LOG_LEVEL || "info";

export const logger = createLogger({
  level,
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
  transports: [new transports.Console()],
});
