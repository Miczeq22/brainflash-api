import { User } from '@core/user-access/user/user.aggregate-root';
import { UniqueEntityID } from '@core/shared/unique-entity-id';

interface UserRecord {
  id: string;
  password: string;
  username: string;
  account_status: string;
}

export const USER_TABLE = 'public.user';

export class UserMapper {
  public static toPersistence(user: User): UserRecord {
    return {
      id: user.getId().getValue(),
      password: user.getPassword(),
      account_status: user.getStatus(),
      username: user.getUsername(),
    };
  }

  public static toEntity(record: UserRecord): User {
    return User.instanceExisting(
      {
        password: record.password,
        status: record.account_status,
        username: record.username,
      },
      new UniqueEntityID(record.id),
    );
  }
}
