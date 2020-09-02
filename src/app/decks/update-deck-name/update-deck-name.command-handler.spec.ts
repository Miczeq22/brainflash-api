import { createMockProxy } from '@tools/mock-proxy';
import { DeckRepository } from '@core/decks/decks/deck.repository';
import { UniqueDeckChecker } from '@core/decks/decks/rules/user-deck-should-have-unique-name.rule';
import { UpdateDeckNameCommandHandler } from './update-deck-name.command-handler';
import { UpdateDeckNameCommand } from './update-deck-name.command';
import { Deck } from '@core/decks/decks/deck.aggregate-root';
import { UniqueEntityID } from '@core/shared/unique-entity-id';

describe('[App] Update deck name command handler', () => {
  const deckRepository = createMockProxy<DeckRepository>();
  const uniqueDeckChecker = createMockProxy<UniqueDeckChecker>();

  beforeEach(() => {
    deckRepository.mockClear();
    uniqueDeckChecker.mockClear();
  });

  test('should throw an error if deck does not exist', async () => {
    deckRepository.findById.mockResolvedValue(null);

    const handler = new UpdateDeckNameCommandHandler({
      deckRepository,
      uniqueDeckChecker,
    });

    await expect(() =>
      handler.handle(
        new UpdateDeckNameCommand({
          deckId: '#deck-id',
          newName: '#new-name',
          userId: '#user-id',
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
          tags: ['#tag'],
        },
        new UniqueEntityID(),
      ),
    );

    const handler = new UpdateDeckNameCommandHandler({
      deckRepository,
      uniqueDeckChecker,
    });

    await expect(() =>
      handler.handle(
        new UpdateDeckNameCommand({
          deckId: '#deck-id',
          newName: '#new-name',
          userId: '#not-deck-owner',
        }),
      ),
    ).rejects.toThrowError('Only deck owner can update deck.');
  });

  test('should update deck name and save it to the database', async () => {
    const ownerId = new UniqueEntityID();
    uniqueDeckChecker.isUnique.mockResolvedValue(true);

    deckRepository.findById.mockResolvedValue(
      Deck.instanceExisting(
        {
          ownerId,
          cardIDs: [],
          createdAt: new Date(),
          description: '#description',
          name: '#name',
          tags: ['#tag'],
        },
        new UniqueEntityID(),
      ),
    );

    const handler = new UpdateDeckNameCommandHandler({
      deckRepository,
      uniqueDeckChecker,
    });

    await handler.handle(
      new UpdateDeckNameCommand({
        deckId: '#deck-id',
        newName: '#new-name',
        userId: ownerId.getValue(),
      }),
    );

    const updatePayload = deckRepository.update.mock.calls[0][0];

    expect(deckRepository.update).toHaveBeenCalledTimes(1);
    expect(updatePayload.getName()).toEqual('#new-name');
  });
});
