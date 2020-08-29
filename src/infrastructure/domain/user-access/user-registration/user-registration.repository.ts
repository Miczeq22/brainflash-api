import { UserRegistrationRepository } from '@core/user-access/user-registration/user-registration.repository';
import { QueryBuilder } from '@infrastructure/database/query-builder';
import { UserRegistration } from '@core/user-access/user-registration/user-registration.aggregate-root';
import { UserRegistrationMapper, USER_REGISTRATION_TABLE } from './user-registration.mapper';
import { NotFoundError } from '@errors/not-found.error';

interface Dependencies {
  queryBuilder: QueryBuilder;
}

export class UserRegistrationRepositoryImpl implements UserRegistrationRepository {
  constructor(private readonly dependencies: Dependencies) {}

  public async insert(userRegistration: UserRegistration) {
    const record = UserRegistrationMapper.toPersistance(userRegistration);

    await this.dependencies.queryBuilder.insert(record).into(USER_REGISTRATION_TABLE);
  }

  public async update(userRegistration: UserRegistration) {
    const { id, ...data } = UserRegistrationMapper.toPersistance(userRegistration);

    const updateCount = await this.dependencies.queryBuilder
      .update(data)
      .where('id', id)
      .into(USER_REGISTRATION_TABLE);

    if (!updateCount) {
      throw new NotFoundError(`User registration entity with id: "${id}" does not exist.`);
    }
  }

  public async findById(id: string) {
    const result = await this.dependencies.queryBuilder
      .where('id', id)
      .from(USER_REGISTRATION_TABLE);

    return result.length ? UserRegistrationMapper.toEntity(result[0]) : null;
  }
}
