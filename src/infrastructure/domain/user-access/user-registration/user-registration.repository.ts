import { UserRegistrationRepository } from '@core/user-access/user-registration/user-registration.repository';
import { QueryBuilder } from '@infrastructure/database/query-builder';
import { UserRegistration } from '@core/user-access/user-registration/user-registration.aggregate-root';
import { UserRegistrationMapper, USER_REGISTRATION_TABLE } from './user-registration.mapper';

interface Dependencies {
  queryBuilder: QueryBuilder;
}

export class UserRegistrationRepositoryImpl implements UserRegistrationRepository {
  constructor(private readonly dependencies: Dependencies) {}

  public async insert(userRegistration: UserRegistration) {
    const record = UserRegistrationMapper.toPersistance(userRegistration);

    await this.dependencies.queryBuilder.insert(record).into(USER_REGISTRATION_TABLE);
  }
}
