import { createMockProxy } from '@tools/mock-proxy';
import { CardRepository } from '@core/cards/card/card.repository';
import { Logger } from '@infrastructure/logger/logger';
import { NewCardAddedSubscriber } from './new-card-added.subscriber';
import { NewCardAddedDomainEvent } from '@core/decks/deck/events/new-card-added.domain-event';
import { UniqueEntityID } from '@core/shared/unique-entity-id';
import { Card } from '@core/decks/card/card.entity';
import { CardReadModelRepository } from '@infrastructure/mongo/domain/cards/card.read-model';
import { DeckRepository } from '@core/decks/deck/deck.repository';
import { DeckReadModelRepository } from '@infrastructure/mongo/domain/decks/deck.read-model';

describe('[App] New card added subscriber', () => {
  const cardRepository = createMockProxy<CardRepository>();
  const logger = createMockProxy<Logger>();
  const cardReadModelRepository = createMockProxy<CardReadModelRepository>();
  const deckRepository = createMockProxy<DeckRepository>();
  const deckReadModelRepository = createMockProxy<DeckReadModelRepository>();

  beforeEach(() => {
    cardRepository.mockClear();
    cardReadModelRepository.mockClear();
    logger.mockClear();
  });

  test('should save card into database', async () => {
    const subscriber = new NewCardAddedSubscriber({
      cardRepository,
      logger,
      cardReadModelRepository,
      deckReadModelRepository,
      deckRepository,
    });

    await subscriber.saveCardToDatabase(
      new NewCardAddedDomainEvent(
        new UniqueEntityID(),
        Card.instanceExisting(
          {
            answer: '#answer',
            question: '#question',
          },
          new UniqueEntityID(),
        ),
      ),
    );

    expect(cardRepository.insert).toHaveBeenCalledTimes(1);
    expect(cardReadModelRepository.insert).toHaveBeenCalledTimes(1);
    expect(logger.info).toHaveBeenCalledTimes(1);
  });
});
