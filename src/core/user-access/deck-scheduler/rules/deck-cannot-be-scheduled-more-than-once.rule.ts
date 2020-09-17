import { BusinessRule } from '@core/shared/business-rule';
import { ScheduledDeck } from '@core/user-access/scheduled-deck/scheduled-deck.entity';

export class DeckCannotBeScheduledMoreThanOnceRule extends BusinessRule {
  message = 'You already scheduled this deck.';

  constructor(
    private readonly scheduledDecks: ScheduledDeck[],
    private readonly deckToSchedule: ScheduledDeck,
  ) {
    super();
  }

  public isBroken() {
    return this.scheduledDecks.some((scheduledDeck) =>
      scheduledDeck.getId().equals(this.deckToSchedule.getId()),
    );
  }
}
