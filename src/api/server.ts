import express, { Application } from 'express';

export class Server {
  private readonly app: Application;

  constructor() {
    this.app = express();

    this.init();
  }

  private init() {
    this.app.use(express.json());

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
