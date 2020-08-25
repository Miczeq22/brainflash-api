import express, { Application, NextFunction } from 'express';
import request from 'supertest';
import { AppError } from '@errors/app.error';
import { NotFoundError } from '@errors/not-found.error';
import { errorHandlerMiddleware } from './error-handler.middleware';
import { createMockProxy } from '@tools/mock-proxy';
import { Logger } from '@infrastructure/logger/logger';

describe('Error handler middleware', () => {
  let app: Application;
  const logger = createMockProxy<Logger>();

  beforeEach(() => {
    jest.resetModules();
    logger.mockClear();
    app = express();
  });

  test('should return 404 status code on route which does not exist', async () => {
    const handler = jest.fn((_, __, next: NextFunction) =>
      next(new NotFoundError('Route not found.')),
    );

    app.get('/does-not-exist', handler);
    app.use(errorHandlerMiddleware(logger));

    const res = await request(app).get('/does-not-exist');

    expect(res.status).toEqual(404);
    expect(res.body.error).toEqual('Route not found.');
  });

  test('should return 500 status code and proper message on default error handle', async () => {
    const handler = jest.fn((_, __, next: NextFunction) => next(new AppError('Error.')));

    app.get('/error', handler);
    app.use(errorHandlerMiddleware(logger));

    const res = await request(app).get('/error');

    expect(res.status).toEqual(500);
    expect(res.body.error).toEqual('Error.');
  });
});
