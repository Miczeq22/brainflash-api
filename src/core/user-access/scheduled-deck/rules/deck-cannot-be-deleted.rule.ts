import { BusinessRule } from '@core/shared/business-rule';

export class DeckCannotBeDeletedRule extends BusinessRule {
  message = 'Cannot schedule deleted deck.';

  constructor(private readonly isDeckDeleted: boolean) {
    super();
  }

  public isBroken() {
    return this.isDeckDeleted;
  }
}
