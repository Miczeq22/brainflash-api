import { Application } from 'express';
import hpp from 'hpp';
import helmet from 'helmet';
import enforceHTTPS from 'express-enforces-ssl';

export const applySecurityMiddleware = (app: Application) => {
  // Don't expose any software infromation.
  app.disable('x-powered-by');

  // Prevent HTTP parameter pollution.
  app.use(hpp());

  /**
   * Enforces HTTPS connections on any incoming request.
   * In case of a non-encrypted HTTP request, express-enforces-ssl automatically redirects
   * to an HTTPS address using a 301 permanent redirect.
   */

  if (process.env.NODE_ENV === 'production') {
    // Enable, in case we're running behind some proxy.
    app.enable('trust proxy');
    app.use(
      /**
       * Visit https://hstspreload.org/ for deployment
       * recommendations.
       */
      helmet.hsts({
        maxAge: 15552000, // 180 days in seconds,
        includeSubDomains: true,
        preload: true,
      }),
    );

    // Redirect HTTP to HTTPS
    app.use(enforceHTTPS());
  }

  /**
   * The xssFilter middleware sets the X-XSS-Protection header to prevent
   * reflected XSS attacks.
   * @see https://helmetjs.github.io/docs/xss-filter/
   */
  app.use(helmet.xssFilter());

  /**
   * Frameguard mitigates clickjacking attacks by setting the X-Frame-Options header.
   *  @see https://helmetjs.github.io/docs/frameguard/
   */
  app.use(
    helmet.frameguard({
      action: 'deny',
    }),
  );

  /**
   * Sets the X-Download-Options to prevent Internet Explorer from executing
   * downloads in your site’s context.
   * @see https://helmetjs.github.io/docs/ienoopen/
   */
  app.use(helmet.ieNoOpen());

  /**
   * Don’t Sniff Mimetype middleware, noSniff, helps prevent browsers from trying
   * to guess (“sniff”) the MIME type, which can have security implications. It
   * does this by setting the X-Content-Type-Options header to nosniff.
   * @see https://helmetjs.github.io/docs/dont-sniff-mimetype/
   */
  app.use(helmet.noSniff());
};
