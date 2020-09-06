import { DomainSubscriber } from '@core/shared/domain-subscriber';
import {
  CardRemovedFromDeckDomainEvent,
  CARD_REMOVED_FROM_DECK_DOMAIN_EVENT,
} from '@core/decks/deck/events/card-removed-from-deck.domain-event';
import { CardRepository } from '@core/cards/card/card.repository';
import { Logger } from '@infrastructure/logger/logger';
import { DomainEvents } from '@core/shared/domain-events';

interface Dependencies {
  cardRepository: CardRepository;
  logger: Logger;
}

export class CardRemovedFromDeckSubscriber extends DomainSubscriber<
  CardRemovedFromDeckDomainEvent
> {
  constructor(private readonly dependencies: Dependencies) {
    super();
  }

  public setupSubscriptions() {
    DomainEvents.register(
      this.removeCardFromDatabase.bind(this),
      CARD_REMOVED_FROM_DECK_DOMAIN_EVENT,
    );
  }

  public async removeCardFromDatabase(event: CardRemovedFromDeckDomainEvent) {
    const { cardRepository, logger } = this.dependencies;

    await cardRepository.remove(event.cardId.getValue());

    logger.info('Card removed from database.');
  }
}
