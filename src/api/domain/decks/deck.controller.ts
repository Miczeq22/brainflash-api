import { Controller } from '@api/controller';
import { Router, RequestHandler } from 'express';
import { createDeckActionValidation } from './actions/create-deck.action';
import { authorizationMiddleware } from '@api/middlewares/auth/auth.middleware';
import { multerUpload } from './actions/upload-deck-image.action';

interface Dependencies {
  createDeckAction: RequestHandler;
  uploadDeckImageAction: RequestHandler;
}

export class DeckController extends Controller {
  constructor(private readonly dependencies: Dependencies) {
    super('/decks');
  }

  public getRouter() {
    const router = Router();

    router.post(
      '/',
      [authorizationMiddleware, createDeckActionValidation],
      this.dependencies.createDeckAction,
    );

    router.post(
      '/upload-image',
      [multerUpload.single('file')],
      this.dependencies.uploadDeckImageAction,
    );

    return router;
  }
}
