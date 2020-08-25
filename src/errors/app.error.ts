export class AppError extends Error {
  constructor(message: string, public readonly name = 'AppError') {
    super(message);

    Error.captureStackTrace(this, AppError.captureStackTrace);
  }
}
