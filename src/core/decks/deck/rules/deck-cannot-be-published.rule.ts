import { BusinessRule } from '@core/shared/business-rule';

export class DeckCannotBePublishedRule extends BusinessRule {
  message = 'Deck is already published.';

  constructor(private readonly isDeckPublished: boolean) {
    super();
  }

  public isBroken() {
    return this.isDeckPublished;
  }
}
