import { createMockProxy } from '@tools/mock-proxy';
import { DeckRepository } from '@core/decks/deck/deck.repository';
import { PublishDeckCommandHandler } from './publish-deck.command-handler';
import { PublishDeckCommand } from './publish-deck.command';
import { UniqueEntityID } from '@core/shared/unique-entity-id';
import { createDeckMock } from '@tests/deck.mock';

describe('[App] Publish deck command handler', () => {
  const deckRepository = createMockProxy<DeckRepository>();

  beforeEach(() => {
    deckRepository.mockClear();
  });

  test('should throw an error if deck does not exist', async () => {
    deckRepository.findById.mockResolvedValue(null);

    const handler = new PublishDeckCommandHandler({
      deckRepository,
    });

    await expect(() =>
      handler.handle(
        new PublishDeckCommand({
          deckId: '#deck-id',
          userId: '#user-id',
        }),
      ),
    ).rejects.toThrowError('Deck does not exist.');
  });

  test('should throw an error if user is not deck owner', async () => {
    deckRepository.findById.mockResolvedValue(createDeckMock());

    const handler = new PublishDeckCommandHandler({
      deckRepository,
    });

    await expect(() =>
      handler.handle(
        new PublishDeckCommand({
          deckId: '#deck-id',
          userId: new UniqueEntityID().getValue(),
        }),
      ),
    ).rejects.toThrowError('Only deck owner can publish deck.');
  });

  test('should publish deck and update it in database', async () => {
    const deck = createDeckMock();

    deckRepository.findById.mockResolvedValue(deck);

    const handler = new PublishDeckCommandHandler({
      deckRepository,
    });

    await handler.handle(
      new PublishDeckCommand({
        deckId: '#deck-id',
        userId: deck.getOwnerId().getValue(),
      }),
    );

    const payload = deckRepository.update.mock.calls[0][0];

    expect(deckRepository.update).toHaveBeenCalledTimes(1);
    expect(payload.isPublished()).toBeTruthy();
  });
});
