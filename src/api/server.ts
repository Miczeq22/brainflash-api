import express, { Application } from 'express';
import corsMiddleware from './middlewares/cors/cors.middleware';
import compression from 'compression';
import { applySecurityMiddleware } from './middlewares/security/security.middleware';
import { NotFoundError } from '@errors/not-found.error';
import { errorHandlerMiddleware } from './middlewares/error-handler/error-handler.middleware';
import { Logger } from '@infrastructure/logger/logger';

interface Dependencies {
  logger: Logger;
}

export class Server {
  private readonly app: Application;

  constructor(private readonly dependencies: Dependencies) {
    this.app = express();

    this.init();
  }

  private init() {
    this.app.use(express.json());
    applySecurityMiddleware(this.app);
    this.app.use(compression());
    this.app.use(corsMiddleware);

    this.app.get('/', (req, res) => {
      res.status(200).json({
        message: 'Hello, World!',
      });
    });

    this.app.use('*', (_, __, next) => next(new NotFoundError('Route does not exist.')));

    this.app.use(errorHandlerMiddleware(this.dependencies.logger));
  }

  public getApp() {
    return this.app;
  }
}
