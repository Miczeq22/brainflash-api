import { DeckRating } from '@core/decks/deck-rating/deck-rating.entity';
import { DeckRatingRepository } from '@core/decks/deck-rating/deck-rating.repository';
import { UniqueEntityID } from '@core/shared/unique-entity-id';
import { QueryBuilder } from '@infrastructure/database/query-builder';
import { DeckRatingMapper, DECK_RATING_TABLE } from './deck-rating.mapper';

interface Dependencies {
  queryBuilder: QueryBuilder;
}

export class DeckRatingRepositoryImpl implements DeckRatingRepository {
  constructor(private readonly dependencies: Dependencies) {}

  public async insert(deckRating: DeckRating) {
    const record = DeckRatingMapper.toPersistence(deckRating);

    await this.dependencies.queryBuilder.insert(record).into(DECK_RATING_TABLE);
  }

  public async update(deckRating: DeckRating) {
    const { id, ...data } = DeckRatingMapper.toPersistence(deckRating);

    await this.dependencies.queryBuilder.update(data).where('id', id).from(DECK_RATING_TABLE);
  }

  public async findByDeck(deckId: UniqueEntityID) {
    const result = await this.dependencies.queryBuilder
      .where('deck_id', deckId.getValue())
      .from(DECK_RATING_TABLE);

    return result.map(DeckRatingMapper.toEntity);
  }

  public async findByUserAndDeck(userId: UniqueEntityID, deckId: UniqueEntityID) {
    const result = await this.dependencies.queryBuilder
      .where('deck_id', deckId.getValue())
      .andWhere('user_id', userId.getValue())
      .from(DECK_RATING_TABLE);

    return result.length ? DeckRatingMapper.toEntity(result[0]) : null;
  }

  public async remove(id: UniqueEntityID) {
    await this.dependencies.queryBuilder
      .where('id', id.getValue())
      .delete()
      .from(DECK_RATING_TABLE);
  }
}
