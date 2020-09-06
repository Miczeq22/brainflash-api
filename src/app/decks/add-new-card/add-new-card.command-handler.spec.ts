import { createMockProxy } from '@tools/mock-proxy';
import { DeckRepository } from '@core/decks/deck/deck.repository';
import { AddNewCardCommandHandler } from './add-new-card.command-handler';
import { AddNewCardCommand } from './add-new-card.command';
import { Deck } from '@core/decks/deck/deck.aggregate-root';
import { UniqueEntityID } from '@core/shared/unique-entity-id';

describe('[App] Add new card command handler', () => {
  const deckRepository = createMockProxy<DeckRepository>();

  beforeEach(() => {
    deckRepository.mockClear();
  });

  test('should throw an error if deck does not exist', async () => {
    deckRepository.findById.mockResolvedValue(null);

    const handler = new AddNewCardCommandHandler({
      deckRepository,
    });

    await expect(() =>
      handler.handle(
        new AddNewCardCommand({
          answer: '#answer',
          question: '#question',
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

    const handler = new AddNewCardCommandHandler({
      deckRepository,
    });

    await expect(() =>
      handler.handle(
        new AddNewCardCommand({
          answer: '#answer',
          question: '#question',
          deckId: '#deck-id',
          userId: new UniqueEntityID().getValue(),
        }),
      ),
    ).rejects.toThrowError('Only deck owner can add card.');
  });

  test('should add new card and return its value', async () => {
    const ownerId = new UniqueEntityID();

    deckRepository.findById.mockResolvedValue(
      Deck.instanceExisting(
        {
          ownerId,
          cards: [],
          createdAt: new Date(),
          description: '#description',
          name: '#name',
          tags: ['#tag'],
        },
        new UniqueEntityID(),
      ),
    );

    const handler = new AddNewCardCommandHandler({
      deckRepository,
    });

    const result = await handler.handle(
      new AddNewCardCommand({
        answer: '#answer',
        question: '#question',
        deckId: '#deck-id',
        userId: ownerId.getValue(),
      }),
    );

    expect(typeof result).toEqual('string');
  });
});
