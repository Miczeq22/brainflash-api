import { createMockProxy } from '@tools/mock-proxy';
import { CardRepository } from '@core/cards/card/card.repository';
import { Logger } from '@infrastructure/logger/logger';
import { NewCardAddedSubscriber } from './new-card-added.subscriber';
import { NewCardAddedDomainEvent } from '@core/decks/deck/events/new-card-added.domain-event';
import { UniqueEntityID } from '@core/shared/unique-entity-id';
import { Card } from '@core/decks/card/card.entity';

describe('[App] New card added subscriber', () => {
  const cardRepository = createMockProxy<CardRepository>();
  const logger = createMockProxy<Logger>();

  beforeEach(() => {
    cardRepository.mockClear();
    logger.mockClear();
  });

  test('should save card into database', async () => {
    const subscriber = new NewCardAddedSubscriber({
      cardRepository,
      logger,
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
    expect(logger.info).toHaveBeenCalledTimes(1);
  });
});
