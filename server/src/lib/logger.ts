import { createLogger, format, transports } from 'winston';
import { env } from "../config";

const isProduction = process.env.NODE_ENV === 'production';

export const logger = createLogger({
  level: env.LOG_LEVEL,
  format: format.combine(format.timestamp(), format.json()),
  transports: [],
});

if (isProduction) {
  logger.add(new transports.Console());

  if (process.env.LOG_FILE) {
    logger.add(
      new transports.File({
        filename: process.env.LOG_FILE,
        maxsize: parseInt(process.env.LOG_MAX_SIZE || '5242880', 10), // 5MB
        maxFiles: parseInt(process.env.LOG_MAX_FILES || '5', 10),
      })
    );
  }
} else {
  logger.add(
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf(({ timestamp, level, message, ...meta }) => {
          const rest = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
          return `[${timestamp}] ${level}: ${message}${rest}`;
        })
      ),
    })
  );
}
