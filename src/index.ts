/* eslint-disable import/first */
/* eslint-disable global-require */

import { createAppContainer } from './app-container';
import { Logger } from '@infrastructure/logger/logger';
import { Application } from 'express';
import { DomainSubscriber } from '@core/shared/domain-subscriber';

require('dotenv').config();

if (process.env.NODE_ENV === 'production') {
  require('module-alias/register');
}

(async () => {
  const container = await createAppContainer();

  const logger = container.resolve<Logger>('logger');
  const app = container.resolve<Application>('app');
  const subscribers = container.resolve<DomainSubscriber<any>[]>('subscribers');

  process.on('uncaughtException', (error) => {
    logger.error(`Uncaught Exception: ${error.toString()}`, error);

    process.exit(1);
  });

  process.on('unhandledRejection', (error) => {
    logger.error(`Unhandled Rejection: ${error.toString()}`, error);

    process.exit(1);
  });

  const port = process.env.PORT;

  subscribers.forEach((subscriber) => subscriber.setupSubscriptions());

  app.listen({ port }, () => {
    logger.info(`Server is listening on ${process.env.PROTOCOL}://${process.env.HOST}:${port}`);
  });
})();
