import { DeckRepository } from '@core/decks/deck/deck.repository';
import {
  CardReadModelMapper,
  CardReadModelRepository,
} from '@infrastructure/mongo/domain/cards/card.read-model';
import { createCardMock } from '@tests/card.mock';
import { createDeckMock } from '@tests/deck.mock';
import { createMockProxy } from '@tools/mock-proxy';
import { GetCardsForDeckQuery } from './get-cards-for-deck.query';
import { GetCardsForDeckQueryHandler } from './get-cards-for-deck.query-handler';

describe('[App] Get cards for deck query handler', () => {
  const cardReadModelRepository = createMockProxy<CardReadModelRepository>();
  const deckRepository = createMockProxy<DeckRepository>();

  beforeEach(() => {
    cardReadModelRepository.mockClear();
    deckRepository.mockClear();
  });

  test('should throw an error if deck does not exist', async () => {
    deckRepository.findById.mockResolvedValue(null);

    const handler = new GetCardsForDeckQueryHandler({
      cardReadModelRepository,
      deckRepository,
    });

    await expect(() =>
      handler.handle(
        new GetCardsForDeckQuery({
          deckId: '#deck-id',
          userId: '#user-id',
        }),
      ),
    ).rejects.toThrowError('Deck does not exist.');
  });

  test('should throw an error if deck is not published', async () => {
    deckRepository.findById.mockResolvedValue(
      createDeckMock({
        published: false,
      }),
    );

    const handler = new GetCardsForDeckQueryHandler({
      cardReadModelRepository,
      deckRepository,
    });

    await expect(() =>
      handler.handle(
        new GetCardsForDeckQuery({
          deckId: '#deck-id',
          userId: '#user-id',
        }),
      ),
    ).rejects.toThrowError('Only deck owner can see unpublised deck.');
  });

  test('should return cards if deck is published', async () => {
    deckRepository.findById.mockResolvedValue(
      createDeckMock({
        published: true,
      }),
    );

    cardReadModelRepository.findAllForDeck.mockResolvedValue([
      CardReadModelMapper.toPersistence(createCardMock()),
    ]);

    const handler = new GetCardsForDeckQueryHandler({
      cardReadModelRepository,
      deckRepository,
    });

    const result = await handler.handle(
      new GetCardsForDeckQuery({
        deckId: '#deck-id',
        userId: '#user-id',
      }),
    );

    expect(result.length).toEqual(1);
  });
});
