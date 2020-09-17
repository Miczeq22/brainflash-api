import { UniqueEntityID } from '@core/shared/unique-entity-id';
import { ScheduledDeck } from './scheduled-deck.entity';

describe('[Domain] Scheduled Deck', () => {
  test('should throw an error if deck is deleted', () => {
    expect(() =>
      ScheduledDeck.createNew({
        deckId: new UniqueEntityID(),
        deleted: true,
        published: true,
        ownerId: new UniqueEntityID(),
        scheduledDate: new Date(),
        userId: new UniqueEntityID(),
      }),
    ).toThrowError('Cannot schedule deleted deck.');
  });

  test('should throw an error if deck is not published and user is not its owner', () => {
    expect(() =>
      ScheduledDeck.createNew({
        deckId: new UniqueEntityID(),
        deleted: false,
        published: false,
        ownerId: new UniqueEntityID(),
        scheduledDate: new Date(),
        userId: new UniqueEntityID(),
      }),
    ).toThrowError('Cannot schedule unpublished deck.');
  });

  test('should throw an error if deck is not published and user is not its owner', () => {
    expect(() =>
      ScheduledDeck.createNew({
        deckId: new UniqueEntityID(),
        deleted: false,
        published: false,
        ownerId: new UniqueEntityID(),
        scheduledDate: new Date(),
        userId: new UniqueEntityID(),
      }),
    ).toThrowError('Cannot schedule unpublished deck.');
  });

  test('should schedule deck if deck is not published but user is its owner', () => {
    const ownerId = new UniqueEntityID();

    expect(
      ScheduledDeck.createNew({
        ownerId,
        deckId: new UniqueEntityID(),
        deleted: false,
        published: false,
        scheduledDate: new Date(),
        userId: ownerId,
      }),
    ).toBeInstanceOf(ScheduledDeck);
  });

  test('should schedule deck if deck if deck is published', () => {
    const ownerId = new UniqueEntityID();

    expect(
      ScheduledDeck.createNew({
        ownerId,
        deckId: new UniqueEntityID(),
        deleted: false,
        published: true,
        scheduledDate: new Date(),
        userId: new UniqueEntityID(),
      }),
    ).toBeInstanceOf(ScheduledDeck);
  });
});
