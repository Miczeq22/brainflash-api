/* eslint-disable @typescript-eslint/no-unused-vars */
import { Logger } from '@infrastructure/logger/logger';
import { ErrorRequestHandler } from 'express';
import { AppError } from '@errors/app.error';
import { NotFoundError } from '@errors/not-found.error';
import { isCelebrate, CelebrateInternalError } from 'celebrate';
import { BusinessRuleValidationError } from '@errors/business-rule-validation.error';
import { UnauthorizedError } from '@errors/unauthorized.error';
import { UnauthenticatedError } from '@errors/unauthenticated.error';
import { InvariantError } from '@errors/invariant.error';

export const errorHandlerMiddleware = (logger: Logger): ErrorRequestHandler => (
  error,
  req,
  res,
  next,
) => {
  logger.error('[API Error]', error);

  if (isCelebrate(error)) {
    return res.status(422).json({
      error: 'Input Validation Error',
      details: (error as CelebrateInternalError).joi.details.map((detail) => ({
        key: detail.context.key,
        message: detail.message,
      })),
    });
  }

  switch ((error as AppError).name) {
    case AppError.name:
    default:
      return res.status(500).json({
        error: (error as AppError).message,
      });

    case BusinessRuleValidationError.name:
    case InvariantError.name:
      return res.status(400).json({
        error: (error as BusinessRuleValidationError).message,
      });

    case UnauthorizedError.name:
      return res.status(401).json({
        error: (error as UnauthorizedError).message,
      });

    case UnauthenticatedError.name:
      return res.status(403).json({
        error: (error as UnauthenticatedError).message,
      });

    case NotFoundError.name:
      return res.status(404).json({
        error: (error as NotFoundError).message,
      });
  }
};
