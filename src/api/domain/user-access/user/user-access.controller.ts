import { Controller } from '@api/controller';
import { Router, RequestHandler } from 'express';
import { loginActionValidation } from './actions/login.action';
import { authorizationMiddleware } from '@api/middlewares/auth/auth.middleware';
import { updateUserPasswordValidation } from './actions/update-user-password.action';
import { refreshTokenActionValidation } from './actions/refresh-token.action';

interface Dependencies {
  updateUserPasswordAction: RequestHandler;
  loginAction: RequestHandler;
  refreshTokenAction: RequestHandler;
}

export class UserAccessController extends Controller {
  constructor(private readonly dependencies: Dependencies) {
    super('/user-access');
  }

  public getRouter() {
    const router = Router();

    router.post('/login', [loginActionValidation], this.dependencies.loginAction);
    router.put(
      '/update-password',
      [authorizationMiddleware, updateUserPasswordValidation],
      this.dependencies.updateUserPasswordAction,
    );

    router.post(
      '/refresh-token',
      [refreshTokenActionValidation],
      this.dependencies.refreshTokenAction,
    );

    return router;
  }
}
