import { createMockProxy } from '@tools/mock-proxy';
import { UniqueDeckChecker } from './rules/user-deck-should-have-unique-name.rule';
import { Deck } from './deck.aggregate-root';
import { UniqueEntityID } from '@core/shared/unique-entity-id';
import { DeckCreatedDomainEvent } from './events/deck-created.domain-event';
import { DeckTagsUpdatedDomainEvent } from './events/deck-tags-updated.domain-event';
import { Card } from '../card/card.entity';
import { NewCardAddedDomainEvent } from './events/new-card-added.domain-event';
import { CardRemovedFromDeckDomainEvent } from './events/card-removed-from-deck.domain-event';

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

  test('should throw an error if deck is not unique', async () => {
    uniqueDeckChecker.isUnique.mockResolvedValue(false);

    const deck = Deck.instanceExisting(
      {
        cards: [],
        createdAt: new Date(),
        description: '#description',
        name: '#name',
        ownerId: new UniqueEntityID(),
        tags: ['#tag-1'],
        deleted: false,
        published: false,
      },
      new UniqueEntityID(),
    );

    await expect(() => deck.updateName('#new-name', uniqueDeckChecker)).rejects.toThrowError(
      'You\'ve already created deck with name: "#new-name".',
    );
  });

  test('should update deck name', async () => {
    uniqueDeckChecker.isUnique.mockResolvedValue(true);

    const deck = Deck.instanceExisting(
      {
        cards: [],
        createdAt: new Date(),
        description: '#description',
        name: '#name',
        ownerId: new UniqueEntityID(),
        tags: ['#tag-1'],
        deleted: false,
        published: false,
      },
      new UniqueEntityID(),
    );

    await deck.updateName('#new-name', uniqueDeckChecker);

    expect(deck.getName()).toEqual('#new-name');
  });

  test('should throw an error if tags are empty on update', async () => {
    const deck = Deck.instanceExisting(
      {
        cards: [],
        createdAt: new Date(),
        description: '#description',
        name: '#name',
        ownerId: new UniqueEntityID(),
        tags: ['#tag-1'],
        deleted: false,
        published: false,
      },
      new UniqueEntityID(),
    );

    expect(() => deck.updateTags([])).toThrowError('Tags for deck cannot be empty.');
  });

  test('should update deck tags and add proper domain event', async () => {
    const deck = Deck.instanceExisting(
      {
        cards: [],
        createdAt: new Date(),
        description: '#description',
        name: '#name',
        ownerId: new UniqueEntityID(),
        tags: ['#tag-1'],
        deleted: false,
        published: false,
      },
      new UniqueEntityID(),
    );

    deck.updateTags(['#new-tag']);

    expect(deck.getTags()).toEqual(['#new-tag']);
    expect(deck.getDomainEvents()[0] instanceof DeckTagsUpdatedDomainEvent).toBeTruthy();
  });

  test('should throw an error if card is already added', async () => {
    const deck = Deck.instanceExisting(
      {
        cards: [
          Card.instanceExisting(
            {
              answer: '#answer',
              question: '#question',
            },
            new UniqueEntityID(),
          ),
        ],
        createdAt: new Date(),
        description: '#description',
        name: '#name',
        ownerId: new UniqueEntityID(),
        tags: ['#tag-1'],
        deleted: false,
        published: false,
      },
      new UniqueEntityID(),
    );

    expect(() =>
      deck.addCard(
        Card.instanceExisting(
          {
            answer: '#answer',
            question: '#question',
          },
          new UniqueEntityID(),
        ),
      ),
    ).toThrowError('You\'ve already added card with question: "#question".');
  });

  test('should add card to deck and proper domain event', async () => {
    const deck = Deck.instanceExisting(
      {
        cards: [
          Card.instanceExisting(
            {
              answer: '#answer',
              question: '#question',
            },
            new UniqueEntityID(),
          ),
        ],
        createdAt: new Date(),
        description: '#description',
        name: '#name',
        ownerId: new UniqueEntityID(),
        tags: ['#tag-1'],
        deleted: false,
        published: false,
      },
      new UniqueEntityID(),
    );

    deck.addCard(
      Card.instanceExisting(
        {
          answer: '#answer',
          question: '#another-question',
        },
        new UniqueEntityID(),
      ),
    );

    expect(deck.getDomainEvents()[0] instanceof NewCardAddedDomainEvent).toBeTruthy();
  });

  test('should throw an error if card does not exist in deck', async () => {
    const deck = Deck.instanceExisting(
      {
        cards: [],
        createdAt: new Date(),
        description: '#description',
        name: '#name',
        ownerId: new UniqueEntityID(),
        tags: ['#tag-1'],
        deleted: false,

        published: false,
      },
      new UniqueEntityID(),
    );

    expect(() => deck.removeCard(new UniqueEntityID())).toThrowError(
      'Card does not exist in deck.',
    );
  });

  test('should remove card from deck and add proper domain event', async () => {
    const card = Card.instanceExisting(
      {
        answer: '#answer',
        question: '#question',
      },
      new UniqueEntityID(),
    );

    const deck = Deck.instanceExisting(
      {
        cards: [card],
        createdAt: new Date(),
        description: '#description',
        name: '#name',
        ownerId: new UniqueEntityID(),
        tags: ['#tag-1'],
        deleted: false,
        published: false,
      },
      new UniqueEntityID(),
    );

    deck.removeCard(card.getId());

    expect(deck.getDomainEvents()[0] instanceof CardRemovedFromDeckDomainEvent).toBeTruthy();
  });

  test('should throw an error if deck is already deleted', async () => {
    const deck = Deck.instanceExisting(
      {
        cards: [],
        createdAt: new Date(),
        description: '#description',
        name: '#name',
        ownerId: new UniqueEntityID(),
        tags: ['#tag-1'],
        deleted: true,
        published: false,
      },
      new UniqueEntityID(),
    );

    expect(() => deck.delete()).toThrowError('Deck is already deleted.');
  });

  test('should delete deck', async () => {
    const deck = Deck.instanceExisting(
      {
        cards: [],
        createdAt: new Date(),
        description: '#description',
        name: '#name',
        ownerId: new UniqueEntityID(),
        tags: ['#tag-1'],
        deleted: false,
        published: false,
      },
      new UniqueEntityID(),
    );

    deck.delete();

    expect(deck.isDeleted()).toBeTruthy();
  });
});
