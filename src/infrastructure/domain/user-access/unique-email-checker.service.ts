import { UniqueEmailChecker } from '@core/user-access/user-registration/rules/user-should-have-unique-email.rule';
import { QueryBuilder } from '@infrastructure/database/query-builder';

interface Dependencies {
  queryBuilder: QueryBuilder;
}

export class UniqueEmailCheckerService implements UniqueEmailChecker {
  constructor(private readonly dependencies: Dependencies) {}

  public async isUnique(email: string) {
    const result = await this.dependencies.queryBuilder
      .select('id')
      .where('email', email)
      .from('user');

    return result.length === 0;
  }
}
