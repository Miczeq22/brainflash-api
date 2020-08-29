import * as Awilix from 'awilix';
import { logger } from '@infrastructure/logger/logger';
import { Server } from '@api/server';
import { postgresQueryBuilder } from '@infrastructure/database/query-builder';
import { UserRegistrationRepositoryImpl } from '@infrastructure/domain/user-access/user-registration/user-registration.repository';
import { UniqueEmailCheckerService } from '@infrastructure/domain/user-access/unique-email-checker.service';
import { Controller } from '@api/controller';
import { UserRegistrationController } from '@api/domain/user-access/user-registration/user-registration.controller';
import { CommandHandler } from '@app/processing/command-handler';
import { RegisterUserCommandHandler } from '@app/user-access/register-user/register-user.command-handler';
import { CommandBus } from '@app/processing/command-bus';
import { MailerService } from '@infrastructure/mailer/mailer.service';
import { DomainSubscriber } from '@core/shared/domain-subscriber';
import { UserRegisteredSubscriber } from '@app/user-access/register-user/user-registered.subscriber';
import { ConfirmAccountCommandHandler } from '@app/user-access/confirm-account/confirm-account.command-handler';

const registerAsArray = <T>(resolvers: Awilix.Resolver<T>[]): Awilix.Resolver<T[]> => ({
  resolve: (container: Awilix.AwilixContainer) => resolvers.map((r) => container.build(r)),
});

export const createAppContainer = async (): Promise<Awilix.AwilixContainer> => {
  const container = Awilix.createContainer({
    injectionMode: Awilix.InjectionMode.PROXY,
  });

  container.loadModules(
    [process.env.NODE_ENV === 'production' ? 'dist/**/**/*.action.js' : 'src/**/**/*.action.ts'],
    {
      formatName: 'camelCase',
      resolverOptions: {
        lifetime: Awilix.Lifetime.SCOPED,
        register: Awilix.asFunction,
      },
    },
  );

  container.register({
    logger: Awilix.asValue(logger),
    server: Awilix.asClass(Server).singleton(),
    queryBuilder: Awilix.asValue(postgresQueryBuilder),
    uniqueEmailChecker: Awilix.asClass(UniqueEmailCheckerService).singleton(),
    mailer: Awilix.asClass(MailerService).singleton(),
  });

  container.register({
    controllers: registerAsArray<Controller>([
      Awilix.asClass(UserRegistrationController).singleton(),
    ]),
  });

  container.register({
    commandBus: Awilix.asClass(CommandBus).singleton(),
    commandHandlers: registerAsArray<CommandHandler<any>>([
      Awilix.asClass(RegisterUserCommandHandler),
      Awilix.asClass(ConfirmAccountCommandHandler),
    ]),
  });

  container.register({
    userRegistrationRepository: Awilix.asClass(UserRegistrationRepositoryImpl).singleton(),
  });

  container.register({
    subscribers: registerAsArray<DomainSubscriber<any>>([
      Awilix.asClass(UserRegisteredSubscriber).singleton(),
    ]),
  });

  const app = container.resolve<Server>('server').getApp();

  container.register({
    app: Awilix.asValue(app),
  });

  return container;
};
