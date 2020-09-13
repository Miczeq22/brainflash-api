import { BusinessRule } from '@core/shared/business-rule';

export class DeckShouldBePublishedRule extends BusinessRule {
  message = 'Cannot unpublish deck. Deck is not published.';

  constructor(private readonly isPublished: boolean) {
    super();
  }

  public isBroken() {
    return !this.isPublished;
  }
}
