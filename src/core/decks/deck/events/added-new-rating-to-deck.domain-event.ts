import { DeckRating } from '@core/decks/deck-rating/deck-rating.entity';
import { DomainEvent } from '@core/shared/domain-event';

export const ADDED_NEW_RATING_TO_DECK_EVENT = 'decks/added-new-rating';

export class AddedNewRatingToDeckEvent extends DomainEvent {
  constructor(public readonly deckRating: DeckRating) {
    super(ADDED_NEW_RATING_TO_DECK_EVENT);
  }
}
