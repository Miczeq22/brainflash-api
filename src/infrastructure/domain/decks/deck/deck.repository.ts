import { DeckRepository } from '@core/decks/decks/deck.repository';
import { Deck } from '@core/decks/decks/deck.aggregate-root';
import { QueryBuilder } from '@infrastructure/database/query-builder';
import { DeckMapper, DECK_TABLE } from './deck.mapper';

interface Dependencies {
  queryBuilder: QueryBuilder;
}

export class DeckRepositoryImpl implements DeckRepository {
  constructor(private readonly dependencies: Dependencies) {}

  public async insert(deck: Deck) {
    const record = DeckMapper.toPersistence(deck);

    await this.dependencies.queryBuilder.insert(record).into(DECK_TABLE);
  }
}
