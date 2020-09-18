import { UniqueEntityID } from '@core/shared/unique-entity-id';
import { ScheduledDeck } from '@core/user-access/scheduled-deck/scheduled-deck.entity';
import { ScheduledDeckRepository } from '@core/user-access/scheduled-deck/scheduled-deck.repository';
import { createMockProxy } from '@tools/mock-proxy';
import { UnscheduleDeckCommand } from './unschedule-deck.command';
import { UnscheduleDeckCommandHandler } from './unschedule-deck.command-handler';

describe('[App] Unschedule deck command handler', () => {
  const scheduledDeckRepository = createMockProxy<ScheduledDeckRepository>();

  beforeEach(() => {
    scheduledDeckRepository.mockClear();
  });

  test('should throw an error if deck does not exist', async () => {
    scheduledDeckRepository.findByUserAndDeck.mockResolvedValue(null);

    const handler = new UnscheduleDeckCommandHandler({
      scheduledDeckRepository,
    });

    await expect(() =>
      handler.handle(
        new UnscheduleDeckCommand({
          deckId: '#deck-id',
          userId: '#user-id',
        }),
      ),
    ).rejects.toThrowError('Deck does not exist.');
  });

  test('should unschedule deck', async () => {
    const deck = ScheduledDeck.instanceExisting(
      {
        ownerId: new UniqueEntityID(),
        scheduledAt: new Date(),
        scheduledDate: new Date(),
        userId: new UniqueEntityID(),
      },
      new UniqueEntityID(),
    );

    scheduledDeckRepository.findByUserAndDeck.mockResolvedValue(deck);

    scheduledDeckRepository.findAllByUser.mockResolvedValue([deck]);

    const handler = new UnscheduleDeckCommandHandler({
      scheduledDeckRepository,
    });

    await expect(
      handler.handle(
        new UnscheduleDeckCommand({
          deckId: '#deck-id',
          userId: '#user-id',
        }),
      ),
    ).resolves.not.toThrowError();
  });
});
