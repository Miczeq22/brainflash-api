import { UserRepository } from '@core/user-access/user/user.repository';
import { QueryBuilder } from '@infrastructure/database/query-builder';
import { USER_TABLE, UserMapper } from './user.mapper';
import { User } from '@core/user-access/user/user.aggregate-root';
import { NotFoundError } from '@errors/not-found.error';

interface Dependencies {
  queryBuilder: QueryBuilder;
}

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly dependencies: Dependencies) {}

  public async findById(id: string) {
    const result = await this.dependencies.queryBuilder.where('id', id).from(USER_TABLE);

    return result.length ? UserMapper.toEntity(result[0]) : null;
  }

  public async findByEmail(email: string) {
    const result = await this.dependencies.queryBuilder.where('email', email).from(USER_TABLE);

    return result.length ? UserMapper.toEntity(result[0]) : null;
  }

  public async update(user: User) {
    const { id, ...data } = UserMapper.toPersistence(user);

    const updateCount = await this.dependencies.queryBuilder
      .update(data)
      .where('id', id)
      .into(USER_TABLE);

    if (!updateCount) {
      throw new NotFoundError(`User entity with id: "${id}" does not exist.`);
    }
  }
}
