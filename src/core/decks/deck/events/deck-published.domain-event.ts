import { DomainEvent } from '@core/shared/domain-event';
import { Deck } from '../deck.aggregate-root';

export const DECK_PUBLISHED_DOMAIN_EVENT = 'decks/deck-published';

export class DeckPublishedDomainEvent extends DomainEvent {
  constructor(public readonly deck: Deck) {
    super(DECK_PUBLISHED_DOMAIN_EVENT);
  }
}
