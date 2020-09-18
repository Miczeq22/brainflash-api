import { CommandHandler } from '@app/processing/command-handler';
import { DeckRepository } from '@core/decks/deck/deck.repository';
import { DomainEvents } from '@core/shared/domain-events';
import { UniqueEntityID } from '@core/shared/unique-entity-id';
import { DeckScheduler } from '@core/user-access/deck-scheduler/deck-scheduler.aggregate-root';
import { ScheduledDeck } from '@core/user-access/scheduled-deck/scheduled-deck.entity';
import { ScheduledDeckRepository } from '@core/user-access/scheduled-deck/scheduled-deck.repository';
import { NotFoundError } from '@errors/not-found.error';
import { ScheduleDeckCommand, SCHEDULE_DECK_COMMAND } from './schedule-deck.command';

interface Dependencies {
  deckRepository: DeckRepository;
  scheduledDeckRepository: ScheduledDeckRepository;
}

export class ScheduleDeckCommandHandler extends CommandHandler<ScheduleDeckCommand> {
  constructor(private readonly dependencies: Dependencies) {
    super(SCHEDULE_DECK_COMMAND);
  }

  public async handle({ payload: { deckId, userId, scheduledDate } }: ScheduleDeckCommand) {
    const { deckRepository, scheduledDeckRepository } = this.dependencies;

    const deck = await deckRepository.findById(deckId);

    if (!deck) {
      throw new NotFoundError('Deck does not exist.');
    }

    const scheduledDecks = await scheduledDeckRepository.findAllByUser(userId);

    const deckToSchedule = ScheduledDeck.createNew({
      deckId: deck.getId(),
      userId: new UniqueEntityID(userId),
      deleted: deck.isDeleted(),
      ownerId: deck.getOwnerId(),
      published: deck.isPublished(),
      scheduledDate: new Date(scheduledDate),
    });

    const deckScheduler = DeckScheduler.instanceExisting({
      scheduledDecks,
      userId: new UniqueEntityID(userId),
    });

    deckScheduler.scheduleNewDeck(deckToSchedule);

    await DomainEvents.dispatchDomainEventsForAggregate(deckScheduler.getId());
  }
}
