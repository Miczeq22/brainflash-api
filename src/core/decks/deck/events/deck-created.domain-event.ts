import { DomainEvent } from '@core/shared/domain-event';
import { UniqueEntityID } from '@core/shared/unique-entity-id';

export const DECK_CREATED_DOMAIN_EVENT = 'decks/deck-created';

export class DeckCreatedDomainEvent extends DomainEvent {
  constructor(public readonly deckTags: string[], public readonly deckId: UniqueEntityID) {
    super(DECK_CREATED_DOMAIN_EVENT);
  }
}
