import { createMockProxy } from '@tools/mock-proxy';
import { DeckRepository } from '@core/decks/decks/deck.repository';
import { UpdateDeckMetadataCommandHandler } from './update-deck-metadata.command-handler';
import { UpdateDeckMetadataCommand } from './update-deck-metadata.command';
import { Deck } from '@core/decks/decks/deck.aggregate-root';
import { UniqueEntityID } from '@core/shared/unique-entity-id';

describe('[App] Update deck metadata command handler', () => {
  const deckRepository = createMockProxy<DeckRepository>();

  beforeEach(() => {
    deckRepository.mockClear();
  });

  test('should throw an error if deck does not exist', async () => {
    deckRepository.findById.mockResolvedValue(null);

    const handler = new UpdateDeckMetadataCommandHandler({
      deckRepository,
    });

    await expect(() =>
      handler.handle(
        new UpdateDeckMetadataCommand({
          deckId: '#deck-id',
          userId: '#user-id',
          description: '#description',
        }),
      ),
    ).rejects.toThrowError('Deck does not exist.');
  });

  test('should throw an error if user is not deck owner', async () => {
    deckRepository.findById.mockResolvedValue(
      Deck.instanceExisting(
        {
          cardIDs: [],
          createdAt: new Date(),
          description: '#description',
          name: '#name',
          ownerId: new UniqueEntityID(),
          tags: ['#tag-1'],
        },
        new UniqueEntityID(),
      ),
    );

    const handler = new UpdateDeckMetadataCommandHandler({
      deckRepository,
    });

    await expect(() =>
      handler.handle(
        new UpdateDeckMetadataCommand({
          deckId: '#deck-id',
          userId: new UniqueEntityID().getValue(),
          description: '#description',
        }),
      ),
    ).rejects.toThrowError('Only deck owner can update deck metadata.');
  });

  test('should update deck metadata', async () => {
    const ownerId = new UniqueEntityID();

    deckRepository.findById.mockResolvedValue(
      Deck.instanceExisting(
        {
          ownerId,
          cardIDs: [],
          createdAt: new Date(),
          description: '#description',
          name: '#name',
          tags: ['#tag-1'],
        },
        new UniqueEntityID(),
      ),
    );

    const handler = new UpdateDeckMetadataCommandHandler({
      deckRepository,
    });

    await handler.handle(
      new UpdateDeckMetadataCommand({
        deckId: '#deck-id',
        userId: ownerId.getValue(),
        description: '#new-description',
        tags: ['#new-tag'],
      }),
    );

    const payload = deckRepository.update.mock.calls[0][0];

    expect(deckRepository.update).toHaveBeenCalledTimes(1);
    expect(payload.getDescription()).toEqual('#new-description');
    expect(payload.getTags()).toEqual(['#new-tag']);
  });
});
