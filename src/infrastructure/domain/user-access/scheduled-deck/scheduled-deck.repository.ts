/* eslint-disable no-await-in-loop */
import { ScheduledDeck } from '@core/user-access/scheduled-deck/scheduled-deck.entity';
import { ScheduledDeckRepository } from '@core/user-access/scheduled-deck/scheduled-deck.repository';
import { QueryBuilder } from '@infrastructure/database/query-builder';
import { ScheduledDeckMapper, SCHEDULED_DECK_TABLE } from './scheduled-deck.mapper';

interface Dependencies {
  queryBuilder: QueryBuilder;
}

export class ScheduledDeckRepositoryImpl implements ScheduledDeckRepository {
  constructor(private readonly dependencies: Dependencies) {}

  public async insert(scheduledDeck: ScheduledDeck) {
    const record = ScheduledDeckMapper.toPersistence(scheduledDeck);

    await this.dependencies.queryBuilder.insert(record).into(SCHEDULED_DECK_TABLE);
  }

  public async findAllByUser(userId: string) {
    const result = await this.dependencies.queryBuilder
      .where('user_id', userId)
      .from(SCHEDULED_DECK_TABLE);

    return result.map(ScheduledDeckMapper.toEntity);
  }

  public async findByUserAndDeck(userId: string, deckId: string) {
    const result = await this.dependencies.queryBuilder
      .where('user_id', userId)
      .andWhere('deck_id', deckId)
      .from(SCHEDULED_DECK_TABLE);

    return result.length ? ScheduledDeckMapper.toEntity(result[0]) : null;
  }

  public async remove(deckId: string, userId: string) {
    await this.dependencies.queryBuilder
      .where('deck_id', deckId)
      .andWhere('user_id', userId)
      .delete()
      .from(SCHEDULED_DECK_TABLE);
  }
}
