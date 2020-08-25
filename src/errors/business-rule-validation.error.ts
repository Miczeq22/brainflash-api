import { AppError } from './app.error';

export class BusinessRuleValidationError extends AppError {
  constructor(message: string) {
    super(message, 'BusinessRuleValidationError');
  }
}
