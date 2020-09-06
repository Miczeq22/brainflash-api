import { UniqueDeckChecker } from '@core/decks/deck/rules/user-deck-should-have-unique-name.rule';
import { QueryBuilder } from '@infrastructure/database/query-builder';
import { DECK_TABLE } from './deck/deck.mapper';

interface Dependencies {
  queryBuilder: QueryBuilder;
}

export class UniqueDeckCheckerService implements UniqueDeckChecker {
  constructor(private readonly dependencies: Dependencies) {}

  public async isUnique(name: string, ownerId: string) {
    const result = await this.dependencies.queryBuilder
      .where('name', name)
      .andWhere('owner_id', ownerId)
      .from(DECK_TABLE);

    return result.length === 0;
  }
}
