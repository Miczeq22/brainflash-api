import { DeckTagRepository } from '@core/decks/deck-tag/deck-tag.repository';
import { QueryBuilder } from '@infrastructure/database/query-builder';
import { DeckTag } from '@core/decks/deck-tag/deck-tag.entity';
import { DeckTagMapper, DECK_TAG_TABLE } from './deck-tag.mapper';

interface Dependencies {
  queryBuilder: QueryBuilder;
}

export class DeckTagRepositoryImpl implements DeckTagRepository {
  constructor(private readonly dependencies: Dependencies) {}

  public async insert(deckTag: DeckTag) {
    const record = DeckTagMapper.toPersistence(deckTag);

    await this.dependencies.queryBuilder.insert(record).into(DECK_TAG_TABLE);
  }
}
