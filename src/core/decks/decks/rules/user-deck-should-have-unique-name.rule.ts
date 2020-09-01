import { BusinessRule } from '@core/shared/business-rule';

export interface UniqueDeckChecker {
  isUnique(name: string, ownerId: string): Promise<boolean>;
}

export class UserDeckShouldHaveUniqueNameRule extends BusinessRule {
  message = `You've already created deck with name: "${this.deckName}".`;

  constructor(
    private readonly uniqueDeckChecker: UniqueDeckChecker,
    private readonly deckName: string,
    private readonly deckOwnerId: string,
  ) {
    super();
  }

  public async isBroken() {
    return !(await this.uniqueDeckChecker.isUnique(this.deckName, this.deckOwnerId));
  }
}
