import { BusinessRule } from '@core/shared/business-rule';
import { ScheduledDeck } from '@core/user-access/scheduled-deck/scheduled-deck.entity';

export class DeckShouldBeScheduledRule extends BusinessRule {
  message = 'Cannot unschedule deck which is not scheduled.';

  constructor(
    private readonly scheduledDecks: ScheduledDeck[],
    private readonly deckToUnschedule: ScheduledDeck,
  ) {
    super();
  }

  public isBroken() {
    return !this.scheduledDecks.some((scheduledDeck) =>
      scheduledDeck.getId().equals(this.deckToUnschedule.getId()),
    );
  }
}
