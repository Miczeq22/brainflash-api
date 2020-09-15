import { DeckRepository } from '@core/decks/deck/deck.repository';
import { createDeckMock } from '@tests/deck.mock';
import { createMockProxy } from '@tools/mock-proxy';
import { EnrollDeckCommand } from './enroll-deck.command';
import { EnrollDeckCommandHandler } from './enroll-deck.command-handler';

describe('[App] Enroll deck command handler', () => {
  const deckRepository = createMockProxy<DeckRepository>();

  beforeEach(() => {
    deckRepository.mockClear();
  });

  test('should throw an error if deck does not exist', async () => {
    deckRepository.findById.mockResolvedValue(null);

    const handler = new EnrollDeckCommandHandler({
      deckRepository,
    });

    await expect(() =>
      handler.handle(
        new EnrollDeckCommand({
          deckId: '#deck-id',
          userId: '#user-id',
        }),
      ),
    ).rejects.toThrowError('Deck does not exist.');
  });

  test('should throw an error if user already enrolled deck', async () => {
    deckRepository.findById.mockResolvedValue(
      createDeckMock({
        published: true,
      }),
    );
    deckRepository.isUserEnrolled.mockResolvedValue(true);

    const handler = new EnrollDeckCommandHandler({
      deckRepository,
    });

    await expect(() =>
      handler.handle(
        new EnrollDeckCommand({
          deckId: '#deck-id',
          userId: '#user-id',
        }),
      ),
    ).rejects.toThrowError('You already enrolled to this deck.');
  });

  test('should enroll deck and save it to database', async () => {
    deckRepository.findById.mockResolvedValue(
      createDeckMock({
        published: true,
      }),
    );

    deckRepository.isUserEnrolled.mockResolvedValue(false);

    const handler = new EnrollDeckCommandHandler({
      deckRepository,
    });

    await handler.handle(
      new EnrollDeckCommand({
        deckId: '#deck-id',
        userId: '#user-id',
      }),
    );

    expect(deckRepository.enrollUser).toHaveBeenCalledTimes(1);
  });
});
