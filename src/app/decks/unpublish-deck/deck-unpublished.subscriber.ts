import {
  DeckUnpublishedDomainEvent,
  DECK_UNPUBLISHED_DOMAIN_EVENT,
} from '@core/decks/deck/events/deck-unpublished.domain-event';
import { DomainEvents } from '@core/shared/domain-events';
import { DomainSubscriber } from '@core/shared/domain-subscriber';
import { DeckReadModelRepository } from '@infrastructure/mongo/domain/decks/deck.read-model';

interface Dependencies {
  deckReadModelRepository: DeckReadModelRepository;
}

export class DeckUnpublishedSubscriber extends DomainSubscriber<DeckUnpublishedDomainEvent> {
  constructor(private readonly dependencies: Dependencies) {
    super();
  }

  public setupSubscriptions() {
    DomainEvents.register(this.updateReadModel.bind(this), DECK_UNPUBLISHED_DOMAIN_EVENT);
  }

  private async updateReadModel(event: DeckUnpublishedDomainEvent) {
    const { deckReadModelRepository } = this.dependencies;

    await deckReadModelRepository.update(event.deck);
  }
}
