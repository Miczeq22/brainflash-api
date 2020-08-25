import * as Winston from 'winston';

export type LogMethod = (level: string, message: string) => Logger;

export type LeveledLogMethod = (message: string, error?: unknown) => Logger;

export interface Logger {
  log: LogMethod;
  error: LeveledLogMethod;
  warn: LeveledLogMethod;
  info: LeveledLogMethod;
  verbose: LeveledLogMethod;
  debug: LeveledLogMethod;
}

const logFormat = Winston.format.printf(
  ({ level, message }) => `$${new Date().toISOString()} | [${level}]: ${message}`,
);

export const logger: Logger = Winston.createLogger({
  level: process.env.LOGGING_LEVEL || 'debug',
  format: Winston.format.combine(
    Winston.format.colorize(),
    Winston.format.splat(),
    Winston.format.align(),
    logFormat,
  ),
  transports: [new Winston.transports.Console()],
});
