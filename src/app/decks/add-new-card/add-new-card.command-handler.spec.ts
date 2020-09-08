import { createMockProxy } from '@tools/mock-proxy';
import { DeckRepository } from '@core/decks/deck/deck.repository';
import { AddNewCardCommandHandler } from './add-new-card.command-handler';
import { AddNewCardCommand } from './add-new-card.command';
import { UniqueEntityID } from '@core/shared/unique-entity-id';
import { createDeckMock } from '@tests/deck.mock';

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
    deckRepository.findById.mockResolvedValue(createDeckMock());

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
      createDeckMock({
        ownerId,
      }),
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
