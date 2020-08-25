/* eslint-disable global-require */
import { corsOptions } from './cors.middleware';

describe('[API] CORS Middleware', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();

    delete process.env.NODE_ENV;
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  test('should allow HTTPS sessions over CORS', () => {
    expect(corsOptions.credentials).toBeTruthy();
  });

  test('should whitelist localhost in non-production environment', () => {
    expect(corsOptions.origin).toContainEqual(/localhost/);
  });

  test('should allow certain origins in production environment', () => {
    process.env.NODE_ENV = 'production';
    process.env.CORS_WHITE_LIST = 'https://google.com';

    expect(require('./cors.middleware').corsOptions.origin).toContainEqual('https://google.com');
  });
});
