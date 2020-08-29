import { AppError } from './app.error';

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized.') {
    super(message, 'UnauthorizedError');
  }
}
