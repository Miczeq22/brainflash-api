import { QueryHandler } from '@app/processing/query-handler';
import { DeckRepository } from '@core/decks/deck/deck.repository';
import { UniqueEntityID } from '@core/shared/unique-entity-id';
import { NotFoundError } from '@errors/not-found.error';
import { UnauthenticatedError } from '@errors/unauthenticated.error';
import {
  CardReadModel,
  CardReadModelRepository,
} from '@infrastructure/mongo/domain/cards/card.read-model';
import { CardCacheRepository } from '@infrastructure/redis/domain/cards/card.cache-repository';
import { GetCardsForDeckQuery, GET_CARDS_FOR_DECK_QUERY } from './get-cards-for-deck.query';

interface Dependencies {
  cardReadModelRepository: CardReadModelRepository;
  deckRepository: DeckRepository;
  cardCacheRepository: CardCacheRepository;
}

export class GetCardsForDeckQueryHandler extends QueryHandler<
  GetCardsForDeckQuery,
  CardReadModel[]
> {
  constructor(private readonly dependencies: Dependencies) {
    super(GET_CARDS_FOR_DECK_QUERY);
  }

  public async handle({ payload: { deckId, userId } }: GetCardsForDeckQuery) {
    const { deckRepository, cardReadModelRepository, cardCacheRepository } = this.dependencies;

    const deck = await deckRepository.findById(deckId);

    if (!deck) {
      throw new NotFoundError('Deck does not exist.');
    }

    const isUserEnrolled = await deckRepository.isUserEnrolled(userId, deckId);

    if (
      !deck.getOwnerId().equals(new UniqueEntityID(userId)) &&
      !isUserEnrolled &&
      !deck.isPublished()
    ) {
      throw new UnauthenticatedError('Only deck owner can see unpublised deck.');
    }

    const cacheKey = `FOR_DECK_${deckId}`;

    let cardsFromCache = await cardCacheRepository.getData(cacheKey);

    if (!cardsFromCache || !cardsFromCache.length) {
      const result = await cardReadModelRepository.findAllForDeck(deckId);

      await cardCacheRepository.persistData(cacheKey, result, 30);

      cardsFromCache = await cardCacheRepository.getData(cacheKey);
    }

    return cardsFromCache;
  }
}
