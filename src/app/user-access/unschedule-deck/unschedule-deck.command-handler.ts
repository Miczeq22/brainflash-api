import { CommandHandler } from '@app/processing/command-handler';
import { DomainEvents } from '@core/shared/domain-events';
import { UniqueEntityID } from '@core/shared/unique-entity-id';
import { DeckScheduler } from '@core/user-access/deck-scheduler/deck-scheduler.aggregate-root';
import { ScheduledDeckRepository } from '@core/user-access/scheduled-deck/scheduled-deck.repository';
import { NotFoundError } from '@errors/not-found.error';
import { UnscheduleDeckCommand, UNSCHEDULE_DECK_COMMAND } from './unschedule-deck.command';

interface Dependencies {
  scheduledDeckRepository: ScheduledDeckRepository;
}

export class UnscheduleDeckCommandHandler extends CommandHandler<UnscheduleDeckCommand> {
  constructor(private readonly dependencies: Dependencies) {
    super(UNSCHEDULE_DECK_COMMAND);
  }

  public async handle({ payload: { deckId, userId } }: UnscheduleDeckCommand) {
    const { scheduledDeckRepository } = this.dependencies;

    const scheduledDeck = await scheduledDeckRepository.findByUserAndDeck(userId, deckId);

    if (!scheduledDeck) {
      throw new NotFoundError('Deck does not exist.');
    }

    const scheduledDecks = await scheduledDeckRepository.findAllByUser(userId);

    const deckScheduler = DeckScheduler.instanceExisting({
      scheduledDecks,
      userId: new UniqueEntityID(userId),
    });

    deckScheduler.unscheduleDeck(scheduledDeck);

    await DomainEvents.dispatchDomainEventsForAggregate(deckScheduler.getId());
  }
}
