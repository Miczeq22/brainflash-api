import { createMockProxy } from '@tools/mock-proxy';
import { DeckRepository } from '@core/decks/deck/deck.repository';
import { RemoveCardCommandHandler } from './remove-card.command-handler';
import { RemoveCardCommand } from './remove-card.command';
import { Deck } from '@core/decks/deck/deck.aggregate-root';
import { UniqueEntityID } from '@core/shared/unique-entity-id';
import { Card } from '@core/decks/card/card.entity';

describe('[App] Remove card command handler', () => {
  const deckRepository = createMockProxy<DeckRepository>();

  beforeEach(() => {
    deckRepository.mockClear();
  });

  test('should throw an error if deck does not exist', async () => {
    deckRepository.findById.mockResolvedValue(null);

    const handler = new RemoveCardCommandHandler({
      deckRepository,
    });

    await expect(() =>
      handler.handle(
        new RemoveCardCommand({
          cardId: '#card-id',
          deckId: '#deck-id',
          userId: '#user-id',
        }),
      ),
    ).rejects.toThrowError('Deck does not exist.');
  });

  test('should throw an error if user is not deck owner', async () => {
    deckRepository.findById.mockResolvedValue(
      Deck.instanceExisting(
        {
          cards: [],
          createdAt: new Date(),
          description: '#description',
          name: '#name',
          ownerId: new UniqueEntityID(),
          tags: ['#tag'],
        },
        new UniqueEntityID(),
      ),
    );

    const handler = new RemoveCardCommandHandler({
      deckRepository,
    });

    await expect(() =>
      handler.handle(
        new RemoveCardCommand({
          cardId: '#card-id',
          deckId: '#deck-id',
          userId: new UniqueEntityID().getValue(),
        }),
      ),
    ).rejects.toThrowError('Only deck owner can remove card.');
  });

  test('should remove card from deck', async () => {
    const ownerId = new UniqueEntityID();

    const card = Card.instanceExisting(
      {
        answer: '#answer',
        question: '#question',
      },
      new UniqueEntityID(),
    );

    deckRepository.findById.mockResolvedValue(
      Deck.instanceExisting(
        {
          ownerId,
          cards: [card],
          createdAt: new Date(),
          description: '#description',
          name: '#name',
          tags: ['#tag'],
        },
        new UniqueEntityID(),
      ),
    );

    const handler = new RemoveCardCommandHandler({
      deckRepository,
    });

    await expect(
      handler.handle(
        new RemoveCardCommand({
          cardId: card.getId().getValue(),
          deckId: '#deck-id',
          userId: ownerId.getValue(),
        }),
      ),
    ).resolves.not.toThrow();
  });
});
