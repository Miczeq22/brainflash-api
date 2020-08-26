import * as Awilix from 'awilix';
import { logger } from '@infrastructure/logger/logger';
import { Server } from '@api/server';
import { postgresQueryBuilder } from '@infrastructure/database/query-builder';
import { UserRegistrationRepositoryImpl } from '@infrastructure/domain/user-access/user-registration/user-registration.repository';
import { UniqueEmailCheckerService } from '@infrastructure/domain/user-access/unique-email-checker.service';

export const createAppContainer = async (): Promise<Awilix.AwilixContainer> => {
  const container = Awilix.createContainer({
    injectionMode: Awilix.InjectionMode.PROXY,
  });

  container.register({
    logger: Awilix.asValue(logger),
    server: Awilix.asClass(Server).singleton(),
    queryBuilder: Awilix.asValue(postgresQueryBuilder),
    uniqueEmailChecker: Awilix.asClass(UniqueEmailCheckerService).singleton(),
  });

  container.register({
    userRegistrationRepository: Awilix.asClass(UserRegistrationRepositoryImpl).singleton(),
  });

  const app = container.resolve<Server>('server').getApp();

  container.register({
    app: Awilix.asValue(app),
  });

  return container;
};
