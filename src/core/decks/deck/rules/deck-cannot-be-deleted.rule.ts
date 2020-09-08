import { BusinessRule } from '@core/shared/business-rule';

export class DeckCannotBeDeletedRule extends BusinessRule {
  message = 'Deck is already deleted.';

  constructor(private readonly isDeleted: boolean) {
    super();
  }

  public isBroken() {
    return this.isDeleted;
  }
}
