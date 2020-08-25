import * as Awilix from 'awilix';
import { logger } from '@infrastructure/logger/logger';
import { Server } from '@api/server';

export const createAppContainer = async (): Promise<Awilix.AwilixContainer> => {
  const container = Awilix.createContainer({
    injectionMode: Awilix.InjectionMode.PROXY,
  });

  container.register({
    logger: Awilix.asValue(logger),
    server: Awilix.asClass(Server).singleton(),
  });

  const app = container.resolve<Server>('server').getApp();

  container.register({
    app: Awilix.asValue(app),
  });

  return container;
};
