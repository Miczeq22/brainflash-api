import { DomainEvent } from '@core/shared/domain-event';
import { Deck } from '../deck.aggregate-root';

export const DECK_CREATED_DOMAIN_EVENT = 'decks/deck-created';

export class DeckCreatedDomainEvent extends DomainEvent {
  constructor(public readonly deck: Deck) {
    super(DECK_CREATED_DOMAIN_EVENT);
  }
}
