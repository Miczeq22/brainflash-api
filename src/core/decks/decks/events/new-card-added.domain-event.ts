import { DomainEvent } from '@core/shared/domain-event';
import { Card } from '@core/decks/card/card.entity';
import { UniqueEntityID } from '@core/shared/unique-entity-id';

export const NEW_CARD_ADDED_DOMAIN_EVENT = 'decks/new-card-added';

export class NewCardAddedDomainEvent extends DomainEvent {
  constructor(public readonly deckId: UniqueEntityID, public readonly card: Card) {
    super(NEW_CARD_ADDED_DOMAIN_EVENT);
  }
}
