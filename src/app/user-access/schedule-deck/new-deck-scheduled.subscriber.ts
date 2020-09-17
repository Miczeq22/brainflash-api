import { DomainEvents } from '@core/shared/domain-events';
import { DomainSubscriber } from '@core/shared/domain-subscriber';
import {
  NewDeckScheduledDomainEvent,
  NEW_DECK_SCHEDULED_DOMAIN_EVENT,
} from '@core/user-access/deck-scheduler/events/new-deck-scheduled.domain-event';
import { ScheduledDeckRepository } from '@core/user-access/scheduled-deck/scheduled-deck.repository';
import { Logger } from '@infrastructure/logger/logger';

interface Dependencies {
  scheduledDeckRepository: ScheduledDeckRepository;
  logger: Logger;
}

export class NewDeckScheduledSubscriber extends DomainSubscriber<NewDeckScheduledDomainEvent> {
  constructor(private readonly dependencies: Dependencies) {
    super();
  }

  public setupSubscriptions() {
    DomainEvents.register(
      this.saveScheduledDeckIntoDatabase.bind(this),
      NEW_DECK_SCHEDULED_DOMAIN_EVENT,
    );
  }

  public async saveScheduledDeckIntoDatabase(event: NewDeckScheduledDomainEvent) {
    const { scheduledDeckRepository, logger } = this.dependencies;

    await scheduledDeckRepository.insert(event.scheduledDeck);

    logger.info('Scheduled deck saved into database.');
  }
}
