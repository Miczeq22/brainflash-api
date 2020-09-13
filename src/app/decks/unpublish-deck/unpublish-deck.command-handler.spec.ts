import { DeckRepository } from '@core/decks/deck/deck.repository';
import { UniqueEntityID } from '@core/shared/unique-entity-id';
import { createDeckMock } from '@tests/deck.mock';
import { createMockProxy } from '@tools/mock-proxy';
import { UnpublishDeckCommand } from './unpublish-deck.command';
import { UnpublishDeckCommandHandler } from './unpublish-deck.command-handler';

describe('[App] Unpublish deck command handler', () => {
  const deckRepository = createMockProxy<DeckRepository>();

  beforeEach(() => {
    deckRepository.mockClear();
  });

  test('should throw an error if deck does not exist', async () => {
    deckRepository.findById.mockResolvedValue(null);

    const handler = new UnpublishDeckCommandHandler({
      deckRepository,
    });

    await expect(() =>
      handler.handle(
        new UnpublishDeckCommand({
          deckId: '#deck-id',
          userId: '#user-id',
        }),
      ),
    ).rejects.toThrowError('Deck does not exist.');
  });

  test('should throw an error if user is not a deck owner', async () => {
    deckRepository.findById.mockResolvedValue(createDeckMock({}));

    const handler = new UnpublishDeckCommandHandler({
      deckRepository,
    });

    await expect(() =>
      handler.handle(
        new UnpublishDeckCommand({
          deckId: '#deck-id',
          userId: new UniqueEntityID().getValue(),
        }),
      ),
    ).rejects.toThrowError('Only deck owner can unpublish deck.');
  });

  test('should unpublish deck and save it to database', async () => {
    const ownerId = new UniqueEntityID();

    deckRepository.findById.mockResolvedValue(
      createDeckMock({
        ownerId,
        published: true,
      }),
    );

    const handler = new UnpublishDeckCommandHandler({
      deckRepository,
    });

    await handler.handle(
      new UnpublishDeckCommand({
        deckId: '#deck-id',
        userId: ownerId.getValue(),
      }),
    );

    const payload = deckRepository.update.mock.calls[0][0];

    expect(payload.isPublished()).toBeFalsy();
    expect(deckRepository.update).toHaveBeenCalledTimes(1);
  });
});
