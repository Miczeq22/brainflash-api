import { DeckRatingRepository } from '@core/decks/deck-rating/deck-rating.repository';
import { DeckRepository } from '@core/decks/deck/deck.repository';
import {
  RatingRemovedFromDeckDomainEvent,
  RATING_REMOVED_FROM_DECK_DOMAIN_EVENT,
} from '@core/decks/deck/events/rating-removed-from-deck.domain-event';
import { DomainEvents } from '@core/shared/domain-events';
import { DomainSubscriber } from '@core/shared/domain-subscriber';
import { DeckReadModelRepository } from '@infrastructure/mongo/domain/decks/deck.read-model';

interface Dependencies {
  deckRepository: DeckRepository;
  deckRatingRepository: DeckRatingRepository;
  deckReadModelRepository: DeckReadModelRepository;
}

export class RatingRemovedFromDeckSubscriber extends DomainSubscriber<
  RatingRemovedFromDeckDomainEvent
> {
  constructor(private readonly dependencies: Dependencies) {
    super();
  }

  public setupSubscriptions() {
    DomainEvents.register(
      this.removeRatingFromDeck.bind(this),
      RATING_REMOVED_FROM_DECK_DOMAIN_EVENT,
    );
  }

  private async removeRatingFromDeck(event: RatingRemovedFromDeckDomainEvent) {
    const { deckRatingRepository, deckReadModelRepository, deckRepository } = this.dependencies;

    const deck = await deckRepository.findById(event.deckId.getValue());

    const deckRating = await deckRatingRepository.findByUserAndDeck(event.userId, event.deckId);

    await deckRatingRepository.remove(deckRating.getId());

    await deckReadModelRepository.update(deck);
  }
}
