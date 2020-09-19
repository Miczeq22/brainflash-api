import { DeckRepository } from '@core/decks/deck/deck.repository';
import { ScheduledDeckRepository } from '@core/user-access/scheduled-deck/scheduled-deck.repository';
import { createDeckMock } from '@tests/deck.mock';
import { createMockProxy } from '@tools/mock-proxy';
import { ScheduleDeckCommand } from './schedule-deck.command';
import { ScheduleDeckCommandHandler } from './schedule-deck.command-handler';
import moment from 'moment';

describe('[App] Schedule deck command handler', () => {
  const deckRepository = createMockProxy<DeckRepository>();
  const scheduledDeckRepository = createMockProxy<ScheduledDeckRepository>();

  beforeEach(() => {
    deckRepository.mockClear();
    scheduledDeckRepository.mockClear();
  });

  test('should throw an error if deck does not exist', async () => {
    deckRepository.findById.mockResolvedValue(null);

    const handler = new ScheduleDeckCommandHandler({
      deckRepository,
      scheduledDeckRepository,
    });

    await expect(() =>
      handler.handle(
        new ScheduleDeckCommand({
          deckId: '#deck-id',
          userId: '#user-id',
          scheduledDate: moment().add(1, 'day').toDate().toISOString(),
        }),
      ),
    ).rejects.toThrowError('Deck does not exist.');
  });

  test('should throw an error if deck does not exist', async () => {
    deckRepository.findById.mockResolvedValue(
      createDeckMock({
        published: true,
      }),
    );

    scheduledDeckRepository.findAllByUser.mockResolvedValue([]);

    const handler = new ScheduleDeckCommandHandler({
      deckRepository,
      scheduledDeckRepository,
    });

    await expect(
      handler.handle(
        new ScheduleDeckCommand({
          deckId: '#deck-id',
          userId: '#user-id',
          scheduledDate: moment().add(1, 'day').toDate().toISOString(),
        }),
      ),
    ).resolves.not.toThrow();
  });
});
