import { DomainSubscriber } from '@core/shared/domain-subscriber';
import {
  NewCardAddedDomainEvent,
  NEW_CARD_ADDED_DOMAIN_EVENT,
} from '@core/decks/deck/events/new-card-added.domain-event';
import { CardRepository } from '@core/cards/card/card.repository';
import { DomainEvents } from '@core/shared/domain-events';
import { Card } from '@core/cards/card/card.aggregate-root';
import { Logger } from '@infrastructure/logger/logger';

interface Dependencies {
  cardRepository: CardRepository;
  logger: Logger;
}

export class NewCardAddedSubscriber extends DomainSubscriber<NewCardAddedDomainEvent> {
  constructor(private readonly dependencies: Dependencies) {
    super();
  }

  public setupSubscriptions() {
    DomainEvents.register(this.saveCardToDatabase.bind(this), NEW_CARD_ADDED_DOMAIN_EVENT);
  }

  public async saveCardToDatabase(event: NewCardAddedDomainEvent) {
    const { cardRepository, logger } = this.dependencies;

    const card = Card.createNew(
      {
        deckId: event.deckId,
        question: event.card.getQuestion(),
        answer: event.card.getAnswer(),
      },
      event.card.getId(),
    );

    await cardRepository.insert(card);

    logger.info('Card saved to database.');
  }
}
