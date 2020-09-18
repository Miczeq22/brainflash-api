import { Controller } from '@api/controller';
import { authorizationMiddleware } from '@api/middlewares/auth/auth.middleware';
import { RequestHandler, Router } from 'express';
import { scheduleNewDeckActionValidation } from './actions/schedule-new-deck.action';
import { unschedulDeckActionValidation } from './actions/unschedule-deck.action';

interface Dependencies {
  scheduleNewDeckAction: RequestHandler;
  unscheduleDeckAction: RequestHandler;
}

export class DeckSchedulerController extends Controller {
  constructor(private readonly dependencies: Dependencies) {
    super('/deck-scheduler');
  }

  public getRouter() {
    const router = Router();

    router.post(
      '/',
      [authorizationMiddleware, scheduleNewDeckActionValidation],
      this.dependencies.scheduleNewDeckAction,
    );

    router.delete(
      '/unschedule',
      [authorizationMiddleware, unschedulDeckActionValidation],
      this.dependencies.unscheduleDeckAction,
    );

    return router;
  }
}
