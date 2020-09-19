import { createMockProxy } from '@tools/mock-proxy';
import { DeckRepository } from '@core/decks/deck/deck.repository';
import { UniqueDeckChecker } from '@core/decks/deck/rules/user-deck-should-have-unique-name.rule';
import { UpdateDeckNameCommandHandler } from './update-deck-name.command-handler';
import { UpdateDeckNameCommand } from './update-deck-name.command';
import { UniqueEntityID } from '@core/shared/unique-entity-id';
import { createDeckMock } from '@tests/deck.mock';
import { DeckReadModelRepository } from '@infrastructure/mongo/domain/decks/deck.read-model';

describe('[App] Update deck name command handler', () => {
  const deckRepository = createMockProxy<DeckRepository>();
  const uniqueDeckChecker = createMockProxy<UniqueDeckChecker>();
  const deckReadModelRepository = createMockProxy<DeckReadModelRepository>();

  beforeEach(() => {
    deckRepository.mockClear();
    uniqueDeckChecker.mockClear();
  });

  test('should throw an error if deck does not exist', async () => {
    deckRepository.findById.mockResolvedValue(null);

    const handler = new UpdateDeckNameCommandHandler({
      deckRepository,
      uniqueDeckChecker,
      deckReadModelRepository,
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
    deckRepository.findById.mockResolvedValue(createDeckMock());

    const handler = new UpdateDeckNameCommandHandler({
      deckRepository,
      uniqueDeckChecker,
      deckReadModelRepository,
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
      createDeckMock({
        ownerId,
      }),
    );

    const handler = new UpdateDeckNameCommandHandler({
      deckRepository,
      uniqueDeckChecker,
      deckReadModelRepository,
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
