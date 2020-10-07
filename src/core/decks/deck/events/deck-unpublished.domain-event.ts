import { DomainEvent } from '@core/shared/domain-event';
import { Deck } from '../deck.aggregate-root';

export const DECK_UNPUBLISHED_DOMAIN_EVENT = 'decks/deck-unpublished';

export class DeckUnpublishedDomainEvent extends DomainEvent {
  constructor(public readonly deck: Deck) {
    super(DECK_UNPUBLISHED_DOMAIN_EVENT);
  }
}
