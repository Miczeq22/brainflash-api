/* eslint-disable import/first */
/* eslint-disable global-require */

import { createAppContainer } from './app-container';
import { Logger } from '@infrastructure/logger/logger';
import { Application } from 'express';

require('dotenv').config();

if (process.env.NODE_ENV === 'production') {
  require('module-alias/register');
}

(async () => {
  const container = await createAppContainer();

  const logger = container.resolve<Logger>('logger');
  const app = container.resolve<Application>('app');

  process.on('uncaughtException', (error) => {
    logger.error(`Uncaught Exception: ${error.toString()}`, error);

    process.exit(1);
  });

  process.on('unhandledRejection', (error) => {
    logger.error(`Unhandled Rejection: ${error.toString()}`, error);

    process.exit(1);
  });

  const port = process.env.PORT;

  app.listen({ port }, () => {
    logger.info(`Server is listening on ${process.env.PROTOCOL}://${process.env.HOST}:${port}`);
  });
})();
