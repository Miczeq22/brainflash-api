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
import { UserRepositoryImpl } from '@infrastructure/domain/user-access/user/user.repository';
import { UserAccessController } from '@api/domain/user-access/user/user-access.controller';
import { LoginCommandHandler } from '@app/user-access/login/login.command-handler';
import { UpdateUserPasswordCommandHandler } from '@app/user-access/update-user-password/update-user-password.command-handler';
import { UniqueDeckCheckerService } from '@infrastructure/domain/decks/unique-deck-checker.service';
import { DeckRepositoryImpl } from '@infrastructure/domain/decks/deck/deck.repository';
import { CreateNewDeckCommandHandler } from '@app/decks/create-new-deck/create-new-deck.command-handler';
import { DeckController } from '@api/domain/decks/deck.controller';
import { DeckCreatedSubscriber } from '@app/decks/create-new-deck/deck-created.subscriber';
import { TagRepositoryImpl } from '@infrastructure/domain/decks/tag/tag.repository';
import { DeckTagRepositoryImpl } from '@infrastructure/domain/decks/deck-tag/deck-tag.repository';
import { UpdateDeckNameCommandHandler } from '@app/decks/update-deck-name/update-deck-name.command-handler';
import { DeckTagsUpdatedSubscriber } from '@app/decks/update-deck-metadata/deck-tags-updated.subscriber';
import { UpdateDeckMetadataCommandHandler } from '@app/decks/update-deck-metadata/update-deck-metadata.command-handler';
import { CardRepositoryImpl } from '@infrastructure/domain/cards/card/card.repository';
import { NewCardAddedSubscriber } from '@app/decks/add-new-card/new-card-added.subscriber';
import { AddNewCardCommandHandler } from '@app/decks/add-new-card/add-new-card.command-handler';
import { RemoveCardCommandHandler } from '@app/decks/remove-card/remove-card.command-handler';
import { CardRemovedFromDeckSubscriber } from '@app/decks/remove-card/card-removed-from-deck.subscriber';
import { DeleteDeckCommandHandler } from '@app/decks/delete-deck/delete-deck.command-handler';
import { PublishDeckCommandHandler } from '@app/decks/publish-deck/publish-deck.command-handler';
import { createMongoClient } from '@infrastructure/mongo/mongo-client';
import { DeckReadModelRepositoryImpl } from '@infrastructure/mongo/domain/decks/deck.read-model-repository';
import { Server as ApolloServer } from '@api/apollo/apollo.server';
import { QueryHandler } from '@app/processing/query-handler';
import { QueryBus } from '@app/processing/query-bus';
import { GetDeckByIdQueryHandler } from '@app/decks/get-deck-by-id/get-deck-by-id.query-handler';
import { EnrollDeckCommandHandler } from '@app/decks/enroll-deck/enroll-deck.command-handler';

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

  const mongoClient = await createMongoClient();

  container.register({
    logger: Awilix.asValue(logger),
    apolloServer: Awilix.asClass(ApolloServer).singleton(),
    server: Awilix.asClass(Server).singleton(),
    queryBuilder: Awilix.asValue(postgresQueryBuilder),
    uniqueEmailChecker: Awilix.asClass(UniqueEmailCheckerService).singleton(),
    mailer: Awilix.asClass(MailerService).singleton(),
    uniqueDeckChecker: Awilix.asClass(UniqueDeckCheckerService).singleton(),
    mongoClient: Awilix.asValue(mongoClient),
  });

  container.register({
    controllers: registerAsArray<Controller>([
      Awilix.asClass(UserRegistrationController).singleton(),
      Awilix.asClass(UserAccessController).singleton(),
      Awilix.asClass(DeckController).singleton(),
    ]),
  });

  container.register({
    commandBus: Awilix.asClass(CommandBus).singleton(),
    commandHandlers: registerAsArray<CommandHandler<any>>([
      Awilix.asClass(RegisterUserCommandHandler).singleton(),
      Awilix.asClass(ConfirmAccountCommandHandler).singleton(),
      Awilix.asClass(LoginCommandHandler).singleton(),
      Awilix.asClass(UpdateUserPasswordCommandHandler).singleton(),
      Awilix.asClass(CreateNewDeckCommandHandler).singleton(),
      Awilix.asClass(UpdateDeckNameCommandHandler).singleton(),
      Awilix.asClass(UpdateDeckMetadataCommandHandler).singleton(),
      Awilix.asClass(AddNewCardCommandHandler).singleton(),
      Awilix.asClass(RemoveCardCommandHandler).singleton(),
      Awilix.asClass(DeleteDeckCommandHandler).singleton(),
      Awilix.asClass(PublishDeckCommandHandler).singleton(),
      Awilix.asClass(EnrollDeckCommandHandler).singleton(),
    ]),
  });

  container.register({
    userRegistrationRepository: Awilix.asClass(UserRegistrationRepositoryImpl).singleton(),
    userRepository: Awilix.asClass(UserRepositoryImpl).singleton(),
    deckRepository: Awilix.asClass(DeckRepositoryImpl).singleton(),
    tagRepository: Awilix.asClass(TagRepositoryImpl).singleton(),
    deckTagRepository: Awilix.asClass(DeckTagRepositoryImpl).singleton(),
    cardRepository: Awilix.asClass(CardRepositoryImpl).singleton(),
    deckReadModelRepository: Awilix.asClass(DeckReadModelRepositoryImpl).singleton(),
  });

  container.register({
    subscribers: registerAsArray<DomainSubscriber<any>>([
      Awilix.asClass(UserRegisteredSubscriber).singleton(),
      Awilix.asClass(DeckCreatedSubscriber).singleton(),
      Awilix.asClass(DeckTagsUpdatedSubscriber).singleton(),
      Awilix.asClass(NewCardAddedSubscriber).singleton(),
      Awilix.asClass(CardRemovedFromDeckSubscriber).singleton(),
    ]),
  });

  container.register({
    queryHandlers: registerAsArray<QueryHandler<any, any>>([
      Awilix.asClass(GetDeckByIdQueryHandler).singleton(),
    ]),
  });

  container.register({
    queryBus: Awilix.asClass(QueryBus).singleton(),
  });

  const app = container.resolve<Server>('server').getApp();

  container.register({
    app: Awilix.asValue(app),
  });

  return container;
};
