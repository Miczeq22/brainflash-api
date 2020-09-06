import { CardRepository } from '@core/cards/card/card.repository';
import { QueryBuilder } from '@infrastructure/database/query-builder';
import { Card } from '@core/cards/card/card.aggregate-root';
import { CardMapper, CARD_TABLE } from './card.mapper';

interface Dependencies {
  queryBuilder: QueryBuilder;
}

export class CardRepositoryImpl implements CardRepository {
  constructor(private readonly dependencies: Dependencies) {}

  public async insert(card: Card) {
    const record = CardMapper.toPersistence(card);

    await this.dependencies.queryBuilder.insert(record).into(CARD_TABLE);
  }

  public async remove(id: string) {
    await this.dependencies.queryBuilder.where('id', id).delete().from(CARD_TABLE);
  }
}
