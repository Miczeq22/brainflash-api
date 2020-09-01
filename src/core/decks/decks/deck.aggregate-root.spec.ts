import { createMockProxy } from '@tools/mock-proxy';
import { UniqueDeckChecker } from './rules/user-deck-should-have-unique-name.rule';
import { Deck } from './deck.aggregate-root';
import { UniqueEntityID } from '@core/shared/unique-entity-id';
import { DeckCreatedDomainEvent } from './events/deck-created.domain-event';

describe('[Domain] Deck', () => {
  const uniqueDeckChecker = createMockProxy<UniqueDeckChecker>();

  beforeEach(() => {
    uniqueDeckChecker.mockClear();
  });

  test('should throw an error if deck for user is not unique', async () => {
    uniqueDeckChecker.isUnique.mockResolvedValue(false);

    await expect(() =>
      Deck.createNew(
        {
          name: '#name',
          description: '#description',
          ownerId: new UniqueEntityID(),
          tags: [],
        },
        uniqueDeckChecker,
      ),
    ).rejects.toThrowError('You\'ve already created deck with name: "#name".');
  });

  test('should throw an error if tags are empty', async () => {
    uniqueDeckChecker.isUnique.mockResolvedValue(true);

    await expect(() =>
      Deck.createNew(
        {
          name: '#name',
          description: '#description',
          ownerId: new UniqueEntityID(),
          tags: [],
        },
        uniqueDeckChecker,
      ),
    ).rejects.toThrowError('Tags for deck cannot be empty.');
  });

  test('should create deck and add proper domain event', async () => {
    uniqueDeckChecker.isUnique.mockResolvedValue(true);

    const deck = await Deck.createNew(
      {
        name: '#name',
        description: '#description',
        ownerId: new UniqueEntityID(),
        tags: ['#tag'],
      },
      uniqueDeckChecker,
    );

    expect(deck.getDomainEvents()[0] instanceof DeckCreatedDomainEvent).toBeTruthy();
  });
});
