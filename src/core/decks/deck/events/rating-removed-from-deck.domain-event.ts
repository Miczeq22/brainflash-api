import { DomainEvent } from '@core/shared/domain-event';
import { UniqueEntityID } from '@core/shared/unique-entity-id';

export const RATING_REMOVED_FROM_DECK_DOMAIN_EVENT = 'decks/rating-removed';

export class RatingRemovedFromDeckDomainEvent extends DomainEvent {
  constructor(public readonly deckId: UniqueEntityID, public readonly userId: UniqueEntityID) {
    super(RATING_REMOVED_FROM_DECK_DOMAIN_EVENT);
  }
}
