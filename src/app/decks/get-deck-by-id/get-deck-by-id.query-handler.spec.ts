import { DeckRepository } from '@core/decks/deck/deck.repository';
import { UniqueEntityID } from '@core/shared/unique-entity-id';
import {
  DeckReadModelMapper,
  DeckReadModelRepository,
} from '@infrastructure/mongo/domain/decks/deck.read-model';
import { createDeckMock } from '@tests/deck.mock';
import { createMockProxy } from '@tools/mock-proxy';
import { GetDeckByIdQuery } from './get-deck-by-id.query';
import { GetDeckByIdQueryHandler } from './get-deck-by-id.query-handler';

describe('[App] Get deck by id query handler', () => {
  const deckRepository = createMockProxy<DeckRepository>();
  const deckReadModelRepository = createMockProxy<DeckReadModelRepository>();

  beforeEach(() => {
    deckRepository.mockClear();
    deckReadModelRepository.mockClear();
  });

  test('should throw an error if deck does not exist', async () => {
    deckRepository.findById.mockResolvedValue(null);

    const handler = new GetDeckByIdQueryHandler({
      deckReadModelRepository,
      deckRepository,
    });

    await expect(() =>
      handler.handle(
        new GetDeckByIdQuery({
          deckId: '#deck-id',
          userId: '#user-id',
        }),
      ),
    ).rejects.toThrowError('Deck does not exist.');
  });

  test('should throw an error if deck is not public', async () => {
    deckRepository.findById.mockResolvedValue(
      createDeckMock({
        published: false,
        ownerId: new UniqueEntityID(),
      }),
    );

    const handler = new GetDeckByIdQueryHandler({
      deckReadModelRepository,
      deckRepository,
    });

    await expect(() =>
      handler.handle(
        new GetDeckByIdQuery({
          deckId: '#deck-id',
          userId: '#user-id',
        }),
      ),
    ).rejects.toThrowError('Only deck owner can see unpublised deck.');
  });

  test('should throw an error if deck read model does not exist', async () => {
    const ownerId = new UniqueEntityID();

    deckRepository.findById.mockResolvedValue(
      createDeckMock({
        ownerId,
        published: false,
      }),
    );

    deckReadModelRepository.findById.mockResolvedValue(null);

    const handler = new GetDeckByIdQueryHandler({
      deckReadModelRepository,
      deckRepository,
    });

    await expect(() =>
      handler.handle(
        new GetDeckByIdQuery({
          deckId: '#deck-id',
          userId: ownerId.getValue(),
        }),
      ),
    ).rejects.toThrowError('Deck read model does not exist.');
  });

  test('should return deck read model', async () => {
    const ownerId = new UniqueEntityID();

    const deck = createDeckMock({
      ownerId,
      published: false,
    });

    deckRepository.findById.mockResolvedValue(deck);

    deckReadModelRepository.findById.mockResolvedValue(
      DeckReadModelMapper.toPersistence(deck, '#owner', 0),
    );

    const handler = new GetDeckByIdQueryHandler({
      deckReadModelRepository,
      deckRepository,
    });

    const result = await handler.handle(
      new GetDeckByIdQuery({
        deckId: '#deck-id',
        userId: ownerId.getValue(),
      }),
    );

    expect(result.cardCount).toEqual(0);
    expect(result.owner).toEqual('#owner');
  });
});
