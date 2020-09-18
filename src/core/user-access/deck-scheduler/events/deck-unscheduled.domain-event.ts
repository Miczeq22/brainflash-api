import { DomainEvent } from '@core/shared/domain-event';
import { ScheduledDeck } from '@core/user-access/scheduled-deck/scheduled-deck.entity';

export const DECK_UNSCHEDULED_DOMAIN_EVENT = 'deck-scheduler/deck-unscheduled';

export class DeckUnscheduledDomainEvent extends DomainEvent {
  constructor(public readonly unscheduledDeck: ScheduledDeck) {
    super(DECK_UNSCHEDULED_DOMAIN_EVENT);
  }
}
