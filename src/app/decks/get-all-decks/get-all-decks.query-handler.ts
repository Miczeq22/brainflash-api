import { QueryHandler } from '@app/processing/query-handler';
import {
  DeckReadModel,
  DeckReadModelRepository,
} from '@infrastructure/mongo/domain/decks/deck.read-model';
import { DeckCacheRepository } from '@infrastructure/redis/domain/decks/deck.cache-repository';
import { GetAllDecksQuery, GET_ALL_DECKS_QUERY } from './get-all-decks.query';

interface Dependencies {
  deckReadModelRepository: DeckReadModelRepository;
  deckCacheRepository: DeckCacheRepository;
}

export class GetAllDecksQueryHandler extends QueryHandler<GetAllDecksQuery, DeckReadModel[]> {
  constructor(private readonly dependencies: Dependencies) {
    super(GET_ALL_DECKS_QUERY);
  }

  public async handle({ payload: { userId, page = 1, limit = 10 } }: GetAllDecksQuery) {
    const { deckReadModelRepository, deckCacheRepository } = this.dependencies;

    const cacheKey = `ALL_${page}_${limit}`;

    let decksFromCache = await deckCacheRepository.getData(cacheKey);

    if (!decksFromCache || !decksFromCache.length) {
      const decks = await deckReadModelRepository.findAll({
        userId,
        page,
        limit,
      });

      await deckCacheRepository.persistData(cacheKey, decks, 60);

      decksFromCache = await deckCacheRepository.getData(cacheKey);
    }

    return decksFromCache.map((deck) => ({ ...deck, isDeckOwner: userId === deck.ownerId }));
  }
}
