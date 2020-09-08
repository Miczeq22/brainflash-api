import { createMockProxy } from '@tools/mock-proxy';
import { DeckRepository } from '@core/decks/deck/deck.repository';
import { DeleteDeckCommandHandler } from './delete-deck.command-handler';
import { DeleteDeckCommand } from './delete-deck.command';
import { Deck } from '@core/decks/deck/deck.aggregate-root';
import { UniqueEntityID } from '@core/shared/unique-entity-id';

describe('[App] Delete deck command handler', () => {
  const deckRepository = createMockProxy<DeckRepository>();

  beforeEach(() => {
    deckRepository.mockClear();
  });

  test('should throw an error if deck does not exist', async () => {
    deckRepository.findById.mockResolvedValue(null);

    const handler = new DeleteDeckCommandHandler({
      deckRepository,
    });

    await expect(() =>
      handler.handle(
        new DeleteDeckCommand({
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
          deleted: false,
          description: '#description',
          name: '#name',
          ownerId: new UniqueEntityID(),
          tags: ['#tag'],
          published: false,
        },
        new UniqueEntityID(),
      ),
    );

    const handler = new DeleteDeckCommandHandler({
      deckRepository,
    });

    await expect(() =>
      handler.handle(
        new DeleteDeckCommand({
          deckId: '#deck-id',
          userId: new UniqueEntityID().getValue(),
        }),
      ),
    ).rejects.toThrowError('Only deck owner can delete deck.');
  });

  test('should delete deck', async () => {
    const ownerId = new UniqueEntityID();

    deckRepository.findById.mockResolvedValue(
      Deck.instanceExisting(
        {
          ownerId,
          cards: [],
          createdAt: new Date(),
          deleted: false,
          description: '#description',
          name: '#name',
          tags: ['#tag'],
          published: false,
        },
        new UniqueEntityID(),
      ),
    );

    const handler = new DeleteDeckCommandHandler({
      deckRepository,
    });

    await handler.handle(
      new DeleteDeckCommand({
        deckId: '#deck-id',
        userId: ownerId.getValue(),
      }),
    );

    const payload = deckRepository.update.mock.calls[0][0];

    expect(deckRepository.update).toHaveBeenCalledTimes(1);
    expect(payload.isDeleted()).toBeTruthy();
  });
});
