import { AppError } from './app.error';

export class InvariantError extends AppError {
  constructor(message: string) {
    super(message, 'InvariantError');
  }
}
