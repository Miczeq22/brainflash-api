import {
  DeckPublishedDomainEvent,
  DECK_PUBLISHED_DOMAIN_EVENT,
} from '@core/decks/deck/events/deck-published.domain-event';
import { DomainEvents } from '@core/shared/domain-events';
import { DomainSubscriber } from '@core/shared/domain-subscriber';
import { DeckReadModelRepository } from '@infrastructure/mongo/domain/decks/deck.read-model';

interface Dependencies {
  deckReadModelRepository: DeckReadModelRepository;
}

export class DeckPublishedSubscriber extends DomainSubscriber<DeckPublishedDomainEvent> {
  constructor(private readonly dependencies: Dependencies) {
    super();
  }

  public setupSubscriptions() {
    DomainEvents.register(this.updateReadModel.bind(this), DECK_PUBLISHED_DOMAIN_EVENT);
  }

  private async updateReadModel(event: DeckPublishedDomainEvent) {
    const { deckReadModelRepository } = this.dependencies;

    await deckReadModelRepository.update(event.deck);
  }
}
