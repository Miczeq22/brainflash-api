import { DomainEvents } from '@core/shared/domain-events';
import { DomainSubscriber } from '@core/shared/domain-subscriber';
import {
  DeckUnscheduledDomainEvent,
  DECK_UNSCHEDULED_DOMAIN_EVENT,
} from '@core/user-access/deck-scheduler/events/deck-unscheduled.domain-event';
import { ScheduledDeckRepository } from '@core/user-access/scheduled-deck/scheduled-deck.repository';
import { Logger } from '@infrastructure/logger/logger';

interface Dependencies {
  scheduledDeckRepository: ScheduledDeckRepository;
  logger: Logger;
}

export class DeckUnscheduledSubscriber extends DomainSubscriber<DeckUnscheduledDomainEvent> {
  constructor(private readonly dependencies: Dependencies) {
    super();
  }

  public setupSubscriptions() {
    DomainEvents.register(
      this.removeScheduledDeckFromDatabase.bind(this),
      DECK_UNSCHEDULED_DOMAIN_EVENT,
    );
  }

  public async removeScheduledDeckFromDatabase(event: DeckUnscheduledDomainEvent) {
    const { scheduledDeckRepository, logger } = this.dependencies;

    await scheduledDeckRepository.remove(
      event.unscheduledDeck.getId().getValue(),
      event.unscheduledDeck.getUserId().getValue(),
    );

    logger.info('Scheduled deck removed from database.');
  }
}
