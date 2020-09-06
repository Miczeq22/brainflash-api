import { createMockProxy } from '@tools/mock-proxy';
import { CardRepository } from '@core/cards/card/card.repository';
import { Logger } from '@infrastructure/logger/logger';
import { CardRemovedFromDeckSubscriber } from './card-removed-from-deck.subscriber';
import { CardRemovedFromDeckDomainEvent } from '@core/decks/decks/events/card-removed-from-deck.domain-event';
import { UniqueEntityID } from '@core/shared/unique-entity-id';

describe('[App] Card removed from deck subscriber', () => {
  const cardRepository = createMockProxy<CardRepository>();
  const logger = createMockProxy<Logger>();

  beforeEach(() => {
    cardRepository.mockClear();
    logger.mockClear();
  });

  test('should remove card from database', async () => {
    const subscriber = new CardRemovedFromDeckSubscriber({
      cardRepository,
      logger,
    });

    await subscriber.removeCardFromDatabase(
      new CardRemovedFromDeckDomainEvent(new UniqueEntityID()),
    );

    expect(cardRepository.remove).toHaveBeenCalledTimes(1);
    expect(logger.info).toHaveBeenCalledTimes(1);
  });
});
