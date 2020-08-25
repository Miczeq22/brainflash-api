import express, { Application } from 'express';
import corsMiddleware from './middlewares/cors/cors.middleware';
import compression from 'compression';
import { applySecurityMiddleware } from './middlewares/security/security.middleware';

export class Server {
  private readonly app: Application;

  constructor() {
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
  }

  public getApp() {
    return this.app;
  }
}
