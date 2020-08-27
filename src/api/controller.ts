import { Router } from 'express';

export abstract class Controller {
  constructor(public readonly route: string) {}

  public abstract getRouter(): Router;
}
