import express, { Application, Response } from 'express';
import { applySecurityMiddleware } from './security.middleware';
import request from 'supertest';

describe('Security middleware', () => {
  const ORIGINAL_ENV = process.env;
  let app: Application;

  const handler = jest.fn((_, res: Response) => {
    res.send('');
  });

  beforeEach(() => {
    handler.mockClear();
    app = express();

    jest.resetModules();

    delete process.env.NODE_ENV;
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  test('should not expose used software', () => {
    applySecurityMiddleware(app);

    expect(app.disabled('x-powered-by')).toBeTruthy();
  });

  test('should prevent HTTP props pollution', async () => {
    applySecurityMiddleware(app);

    app.get('/', handler);

    await request(app).get('/?first-prop=a&second-prop=b&first-prop=c');

    const [req] = handler.mock.calls.pop();

    expect(req.query).toEqual({
      'first-prop': 'c',
      'second-prop': 'b',
    });
  });

  test('should prevent HTTP props pollution', async () => {
    applySecurityMiddleware(app);

    app.get('/', handler);

    await request(app).get('/?first-prop=a&second-prop=b&first-prop=c');

    const [req] = handler.mock.calls.pop();

    expect(req.query).toEqual({
      'first-prop': 'c',
      'second-prop': 'b',
    });
  });

  test('should not enforce SSL in non-production environment', async () => {
    applySecurityMiddleware(app);

    app.get('/', handler);

    await request(app).get('/');

    const [req] = handler.mock.calls.pop();

    expect(req.protocol).toEqual('http');
  });

  test('should enforce SSL in production environment', async () => {
    process.env.NODE_ENV = 'production';
    applySecurityMiddleware(app);

    app.get('/', handler);

    expect(app.enabled('trust proxy')).toBeTruthy();

    await request(app)
      .get('/')
      .expect(301)
      .expect('location', /^https/)
      .expect('Strict-Transport-Security', /max-age=\d+/)
      .expect('Strict-Transport-Security', /includeSubDomains/)
      .expect('Strict-Transport-Security', /preload/);
  });

  test('enable XSS protection', async () => {
    applySecurityMiddleware(app);
    app.get('/', handler);

    await request(app).get('/').expect(200).expect('X-XSS-Protection', '0');
  });

  test('should enable X-Frame-Options', async () => {
    applySecurityMiddleware(app);

    app.get('/', handler);

    await request(app).get('/').expect(200).expect('X-Frame-Options', /deny/i);
  });

  test('should disable IE downloads', async () => {
    applySecurityMiddleware(app);

    app.get('/', handler);

    await request(app).get('/').expect(200).expect('X-Download-Options', 'noopen');
  });

  test('should prevent mime type sniffing', async () => {
    applySecurityMiddleware(app);

    app.get('/', handler);

    await request(app).get('/').expect(200).expect('X-Content-Type-Options', 'nosniff');
  });
});
