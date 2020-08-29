import { UniqueEmailChecker } from '@core/user-access/user-registration/rules/user-should-have-unique-email.rule';
import { QueryBuilder } from '@infrastructure/database/query-builder';
import { AccountStatus } from '@core/user-access/user-registration/account-status.value-object';

interface Dependencies {
  queryBuilder: QueryBuilder;
}

export class UniqueEmailCheckerService implements UniqueEmailChecker {
  constructor(private readonly dependencies: Dependencies) {}

  public async isUnique(email: string) {
    const result = await this.dependencies.queryBuilder
      .select('id', 'account_status')
      .where('email', email)
      .from('user');

    if (result.length) {
      return result[0].account_status === AccountStatus.Expired.getValue();
    }

    return result.length === 0;
  }
}
