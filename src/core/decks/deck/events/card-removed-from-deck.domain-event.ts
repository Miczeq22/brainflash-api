import { DomainEvent } from '@core/shared/domain-event';
import { UniqueEntityID } from '@core/shared/unique-entity-id';

export const CARD_REMOVED_FROM_DECK_DOMAIN_EVENT = 'decks/card-removed-from-deck';

export class CardRemovedFromDeckDomainEvent extends DomainEvent {
  constructor(public readonly cardId: UniqueEntityID) {
    super(CARD_REMOVED_FROM_DECK_DOMAIN_EVENT);
  }
}
