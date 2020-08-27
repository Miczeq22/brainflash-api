import express, { Application } from 'express';
import corsMiddleware from './middlewares/cors/cors.middleware';
import compression from 'compression';
import { applySecurityMiddleware } from './middlewares/security/security.middleware';
import { NotFoundError } from '@errors/not-found.error';
import { errorHandlerMiddleware } from './middlewares/error-handler/error-handler.middleware';
import { Logger } from '@infrastructure/logger/logger';
import { Controller } from './controller';
import * as swaggerUi from 'swagger-ui-express';
import { swaggerDocs } from '@infrastructure/swagger';

interface Dependencies {
  logger: Logger;
  controllers: Controller[];
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
      res.redirect(308, `${req.baseUrl}/api-docs`);
    });

    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

    this.dependencies.controllers.forEach((controller) => {
      this.app.use(controller.route, controller.getRouter());
    });

    this.app.use('*', (_, __, next) => next(new NotFoundError('Route does not exist.')));

    this.app.use(errorHandlerMiddleware(this.dependencies.logger));
  }

  public getApp() {
    return this.app;
  }
}
