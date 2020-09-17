import { DomainEvent } from '@core/shared/domain-event';
import { ScheduledDeck } from '@core/user-access/scheduled-deck/scheduled-deck.entity';

export const NEW_DECK_SCHEDULED_DOMAIN_EVENT = 'deck-scheduler/new-deck-scheduled';

export class NewDeckScheduledDomainEvent extends DomainEvent {
  constructor(public readonly scheduledDeck: ScheduledDeck) {
    super(NEW_DECK_SCHEDULED_DOMAIN_EVENT);
  }
}
