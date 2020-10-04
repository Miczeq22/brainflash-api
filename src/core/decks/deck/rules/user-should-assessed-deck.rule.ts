import { BusinessRule } from '@core/shared/business-rule';
import { UniqueEntityID } from '@core/shared/unique-entity-id';

export interface DeckRateChecker {
  isRatedByUser(userId: UniqueEntityID, deckId: UniqueEntityID): Promise<boolean>;
}

export class UserShouldAssessedDeckRule extends BusinessRule {
  message = 'The Deck has not been assessed.';

  constructor(
    private readonly deckRateChecker: DeckRateChecker,
    private readonly userId: UniqueEntityID,
    private readonly deckId: UniqueEntityID,
  ) {
    super();
  }

  public async isBroken() {
    return !(await this.deckRateChecker.isRatedByUser(this.userId, this.deckId));
  }
}
