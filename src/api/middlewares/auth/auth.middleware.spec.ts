import express, { Response, Application } from 'express';
import request from 'supertest';
import { authorizationMiddleware } from './auth.middleware';
import { errorHandlerMiddleware } from '../error-handler/error-handler.middleware';
import { createMockProxy } from '@tools/mock-proxy';
import { Logger } from '@infrastructure/logger/logger';
import jwt from 'jsonwebtoken';
import { UniqueEntityID } from '@core/shared/unique-entity-id';

describe('[API] Auth middleware', () => {
  let app: Application;
  const logger = createMockProxy<Logger>();

  const handler = jest.fn((_, res: Response) => {
    res.status(200).send('');
  });

  beforeEach(() => {
    handler.mockClear();
    app = express();

    jest.resetModules();
  });

  test('should return error if token is not passed', async () => {
    app.get('/', [authorizationMiddleware], handler);
    app.use(errorHandlerMiddleware(logger));

    const res = await request(app).get('/');

    expect(res.statusCode).toEqual(401);
    expect(res.body.error).toEqual('Unauthorized.');
  });

  test('should return error if token is invalid', async () => {
    process.env.JWT_TOKEN = 'secret';

    const invalidToken = jwt.sign(
      {
        userId: new UniqueEntityID().getValue(),
      },
      'invalid-secret',
    );

    app.get('/', [authorizationMiddleware], handler);
    app.use(errorHandlerMiddleware(logger));

    const res = await request(app).get('/').set('Authorization', `Bearer ${invalidToken}`);

    expect(res.statusCode).toEqual(401);
    expect(res.body.error).toEqual('Unauthorized.');
  });

  test('should return response if token is valid', async () => {
    process.env.JWT_TOKEN = 'secret';
    const userId = new UniqueEntityID().getValue();

    const validToken = jwt.sign(
      {
        userId,
      },
      'secret',
    );

    app.get('/', [authorizationMiddleware], handler);
    app.use(errorHandlerMiddleware(logger));

    const res = await request(app).get('/').set('Authorization', `Bearer ${validToken}`);

    expect(res.statusCode).toEqual(200);
  });
});
