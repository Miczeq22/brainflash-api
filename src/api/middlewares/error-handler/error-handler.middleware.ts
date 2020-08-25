/* eslint-disable @typescript-eslint/no-unused-vars */
import { Logger } from '@infrastructure/logger/logger';
import { ErrorRequestHandler } from 'express';
import { AppError } from '@errors/app.error';
import { NotFoundError } from '@errors/not-found.error';

export const errorHandlerMiddleware = (logger: Logger): ErrorRequestHandler => (
  error,
  req,
  res,
  next,
) => {
  logger.error('[API Error]', error);

  switch ((error as AppError).name) {
    case AppError.name:
    default:
      return res.status(500).json({
        error: (error as AppError).message,
      });

    case NotFoundError.name:
      return res.status(404).json({
        error: (error as NotFoundError).message,
      });
  }
};
