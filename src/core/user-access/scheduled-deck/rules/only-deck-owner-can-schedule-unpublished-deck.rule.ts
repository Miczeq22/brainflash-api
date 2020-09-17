import { BusinessRule } from '@core/shared/business-rule';
import { UniqueEntityID } from '@core/shared/unique-entity-id';

export class OnlyDeckOwnerCanScheduleUnpublishedDeckRule extends BusinessRule {
  message = 'Cannot schedule unpublished deck.';

  constructor(
    private readonly isDeckPublished: boolean,
    private readonly deckOwnerId: UniqueEntityID,
    private readonly userId: UniqueEntityID,
  ) {
    super();
  }

  public isBroken() {
    return !this.isDeckPublished && !this.deckOwnerId.equals(this.userId);
  }
}
