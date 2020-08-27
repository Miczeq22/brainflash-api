import { Controller } from '@api/controller';
import { Router, RequestHandler } from 'express';
import { RegisterUserValidation } from './actions/register-user.action';

interface Dependencies {
  registerUserAction: RequestHandler;
}

export class UserRegistrationController extends Controller {
  constructor(private readonly dependencies: Dependencies) {
    super('/register');
  }

  public getRouter() {
    const router = Router();

    router.post('/', [RegisterUserValidation], this.dependencies.registerUserAction);

    return router;
  }
}
