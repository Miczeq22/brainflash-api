import { BusinessRule } from '@core/shared/business-rule';

export class DeckTagsCannotBeEmptyRule extends BusinessRule {
  message = 'Tags for deck cannot be empty.';

  constructor(private readonly tags: string[]) {
    super();
  }

  public isBroken() {
    return this.tags.length === 0;
  }
}
