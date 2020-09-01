import { createMockProxy } from '@tools/mock-proxy';
import { DeckRepository } from '@core/decks/decks/deck.repository';
import { UniqueDeckChecker } from '@core/decks/decks/rules/user-deck-should-have-unique-name.rule';
import { CreateNewDeckCommandHandler } from './create-new-deck.command-handler';
import { CreateNewDeckCommand } from './create-new-deck.command';

describe('[App] Create new deck command handler', () => {
  const deckRepository = createMockProxy<DeckRepository>();
  const uniqueDeckChecker = createMockProxy<UniqueDeckChecker>();

  beforeEach(() => {
    deckRepository.mockClear();
    uniqueDeckChecker.mockClear();
  });

  test('should insert deck to database and return deck id', async () => {
    uniqueDeckChecker.isUnique.mockResolvedValue(true);

    const handler = new CreateNewDeckCommandHandler({
      deckRepository,
      uniqueDeckChecker,
    });

    const deckId = await handler.handle(
      new CreateNewDeckCommand({
        description: '#description',
        name: '#name',
        ownerId: '#owner-id',
        tags: ['#tag-1'],
        imageUrl: '#image-url',
      }),
    );

    const insertPayload = deckRepository.insert.mock.calls[0][0];

    expect(insertPayload.getId().getValue()).toEqual(deckId);
    expect(deckRepository.insert).toHaveBeenCalledTimes(1);
  });
});
