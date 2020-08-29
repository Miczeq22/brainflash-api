import { Controller } from '@api/controller';
import { Router, RequestHandler } from 'express';
import { loginActionValidation } from './actions/login.action';

interface Dependencies {
  updateUserPasswordAction: RequestHandler;
  loginAction: RequestHandler;
}

export class UserAccessController extends Controller {
  constructor(private readonly dependencies: Dependencies) {
    super('/user-access');
  }

  public getRouter() {
    const router = Router();

    router.post('/login', [loginActionValidation], this.dependencies.loginAction);

    return router;
  }
}
