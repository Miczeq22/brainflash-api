import { RequestHandler } from 'express';
import { UnauthorizedError } from '@errors/unauthorized.error';
import jwt from 'jsonwebtoken';

export const authorizationMiddleware: RequestHandler = (req, res, next) => {
  const token = req.headers.authorization ? req.headers.authorization.slice(7) : null;

  let payload: { userId: string };

  if (!token) {
    next(new UnauthorizedError());
  }

  try {
    payload = jwt.verify(token, process.env.JWT_TOKEN) as { userId: string };
  } catch {
    return next(new UnauthorizedError());
  }

  res.locals.userId = payload.userId;

  next();
};
