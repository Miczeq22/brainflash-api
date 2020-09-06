import { Controller } from '@api/controller';
import { Router, RequestHandler } from 'express';
import { createDeckActionValidation } from './actions/create-deck.action';
import { authorizationMiddleware } from '@api/middlewares/auth/auth.middleware';
import { multerUpload } from './actions/upload-deck-image.action';
import { updateDeckNameActionValidation } from './actions/update-deck-name.action';
import { updateDeckMetadataActionValidation } from './actions/update-deck-metadata.action';
import { addNewCardActionValidation } from './actions/add-new-card.action';

interface Dependencies {
  createDeckAction: RequestHandler;
  uploadDeckImageAction: RequestHandler;
  updateDeckNameAction: RequestHandler;
  updateDeckMetadataAction: RequestHandler;
  addNewCardAction: RequestHandler;
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
      [authorizationMiddleware, multerUpload.single('file')],
      this.dependencies.uploadDeckImageAction,
    );

    router.put(
      '/update-name',
      [authorizationMiddleware, updateDeckNameActionValidation],
      this.dependencies.updateDeckNameAction,
    );

    router.put(
      '/update-metadata',
      [authorizationMiddleware, updateDeckMetadataActionValidation],
      this.dependencies.updateDeckMetadataAction,
    );

    router.post(
      '/add-card',
      [authorizationMiddleware, addNewCardActionValidation],
      this.dependencies.addNewCardAction,
    );

    return router;
  }
}
