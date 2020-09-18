import { UniqueEntityID } from '@core/shared/unique-entity-id';
import { ScheduledDeck } from '../scheduled-deck/scheduled-deck.entity';
import { DeckScheduler } from './deck-scheduler.aggregate-root';
import { DeckUnscheduledDomainEvent } from './events/deck-unscheduled.domain-event';
import { NewDeckScheduledDomainEvent } from './events/new-deck-scheduled.domain-event';

describe('[Domain] Deck Scheduler', () => {
  test('should throw an error if deck is already scheduled', () => {
    const scheduledDeck = ScheduledDeck.instanceExisting(
      {
        ownerId: new UniqueEntityID(),
        scheduledAt: new Date(),
        scheduledDate: new Date(),
        userId: new UniqueEntityID(),
      },
      new UniqueEntityID(),
    );

    const deckScheduler = DeckScheduler.instanceExisting({
      scheduledDecks: [scheduledDeck],
      userId: new UniqueEntityID(),
    });

    expect(() => deckScheduler.scheduleNewDeck(scheduledDeck)).toThrowError(
      'You already scheduled this deck.',
    );
  });

  test('should schedule deck and add proper domain event', () => {
    const scheduledDeck = ScheduledDeck.instanceExisting(
      {
        ownerId: new UniqueEntityID(),
        scheduledAt: new Date(),
        scheduledDate: new Date(),
        userId: new UniqueEntityID(),
      },
      new UniqueEntityID(),
    );

    const deckScheduler = DeckScheduler.instanceExisting({
      scheduledDecks: [],
      userId: new UniqueEntityID(),
    });

    deckScheduler.scheduleNewDeck(scheduledDeck);

    expect(deckScheduler.getDomainEvents()[0] instanceof NewDeckScheduledDomainEvent).toBeTruthy();
  });

  test('should throw an error if deck is not scheduled', () => {
    const deckScheduler = DeckScheduler.instanceExisting({
      userId: new UniqueEntityID(),
      scheduledDecks: [],
    });

    expect(() =>
      deckScheduler.unscheduleDeck(
        ScheduledDeck.instanceExisting(
          {
            ownerId: new UniqueEntityID(),
            scheduledAt: new Date(),
            scheduledDate: new Date(),
            userId: new UniqueEntityID(),
          },
          new UniqueEntityID(),
        ),
      ),
    ).toThrowError('Cannot unschedule deck which is not scheduled.');
  });

  test('should unschedule deck', () => {
    const deck = ScheduledDeck.instanceExisting(
      {
        ownerId: new UniqueEntityID(),
        scheduledAt: new Date(),
        scheduledDate: new Date(),
        userId: new UniqueEntityID(),
      },
      new UniqueEntityID(),
    );

    const deckScheduler = DeckScheduler.instanceExisting({
      userId: new UniqueEntityID(),
      scheduledDecks: [deck],
    });

    deckScheduler.unscheduleDeck(deck);

    expect(deckScheduler.getDomainEvents()[0] instanceof DeckUnscheduledDomainEvent).toBeTruthy();
  });
});
