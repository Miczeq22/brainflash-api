import { BusinessRule } from '@core/shared/business-rule';
import { Card } from '@core/decks/card/card.entity';
import { UniqueEntityID } from '@core/shared/unique-entity-id';

export class CardShouldExistInDeckRule extends BusinessRule {
  message = 'Card does not exist in deck.';

  constructor(private readonly cards: Card[], private readonly cardId: UniqueEntityID) {
    super();
  }

  public isBroken() {
    return !this.cards.some((card) => card.getId().equals(this.cardId));
  }
}
