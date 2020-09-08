import { AppError } from './app.error';

export class UnauthenticatedError extends AppError {
  constructor(message = 'Unauthenticated.') {
    super(message, 'UnauthenticatedError');
  }
}
