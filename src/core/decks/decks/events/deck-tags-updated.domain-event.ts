import { DomainEvent } from '@core/shared/domain-event';
import { UniqueEntityID } from '@core/shared/unique-entity-id';

export const DECK_TAGS_UPDATED_DOMAIN_EVENT = 'decks/deck-tags-updated';

export class DeckTagsUpdatedDomainEvent extends DomainEvent {
  constructor(public readonly deckId: UniqueEntityID, public readonly newTags: string[]) {
    super(DECK_TAGS_UPDATED_DOMAIN_EVENT);
  }
}
