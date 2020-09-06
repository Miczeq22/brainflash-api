import { BusinessRule } from '@core/shared/business-rule';
import { Card } from '@core/decks/card/card.entity';

export class CardWithSameQuestionCannotBeAddedTwiceRule extends BusinessRule {
  message = `You've already added card with question: "${this.cardToAdd.getQuestion()}".`;

  constructor(private readonly cards: Card[], private readonly cardToAdd: Card) {
    super();
  }

  public isBroken() {
    return this.cards.some(
      (card) => card.getQuestion().trim() === this.cardToAdd.getQuestion().trim(),
    );
  }
}
